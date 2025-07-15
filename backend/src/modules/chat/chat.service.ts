import { Injectable } from '@nestjs/common';
import {
  convertToCoreMessages,
  pipeDataStreamToResponse,
  streamText,
} from 'ai';
import { Response } from 'express';
import { ChatRepository } from './chat.repository';
import { MessageRepository } from './message.repository';
import {
  Chat,
  ErrChatNotFound,
  ErrModelNotFound,
  ErrUserMessageNotFound,
  Message,
  SendMessageDTO,
} from './model';
import { AppError, ErrForbidden } from 'src/shared';
import {
  customModel,
  generateTitleFromUserMessage,
  getMostRecentUserMessage,
  models,
  sanitizeResponseMessages,
  systemPrompt,
} from 'src/shared/ai';
import { v7 } from 'uuid';
import { PromptService } from '../prompt/prompt.service';
import { z } from 'zod';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRepo: ChatRepository,
    private readonly messageRepo: MessageRepository,
    private readonly promptService: PromptService,
  ) {}

  async findMessagesByChatId(
    chatId: string,
    userId: string,
  ): Promise<Message[]> {
    const chat = await this.chatRepo.findById(chatId);
    if (!chat) {
      throw AppError.from(ErrChatNotFound, 404);
    }

    if (chat.userId !== userId) {
      throw AppError.from(ErrForbidden, 403);
    }

    return this.messageRepo.findByChatId(chatId);
  }

  async findById(id: string): Promise<Chat> {
    const chat = await this.chatRepo.findById(id);
    if (!chat) {
      throw AppError.from(ErrChatNotFound, 404);
    }
    return chat;
  }

  async findByUserId(userId: string): Promise<Chat[]> {
    return this.chatRepo.findByUserId(userId);
  }

  async streamResponse(
    dto: SendMessageDTO,
    res: Response,
    userId: string | null,
  ) {
    const { id, messages, modelId, systemInstruction, promptId } = dto;

    const model = models.find((model) => model.id === modelId);

    if (!model) {
      throw AppError.from(ErrModelNotFound, 404);
    }

    const coreMessages = convertToCoreMessages(messages);
    const userMessage = getMostRecentUserMessage(coreMessages);

    if (!userMessage) {
      throw AppError.from(ErrUserMessageNotFound, 400);
    }

    if (userId) {
      const chat = await this.chatRepo.findById(id);

      if (!chat) {
        const title = await generateTitleFromUserMessage({
          message: userMessage,
        });

        const newChat: Chat = {
          id,
          userId,
          title,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await this.chatRepo.insert(newChat);
      }

      const newMessages: Message[] = [
        {
          ...userMessage,
          id: v7(),
          createdAt: new Date(),
          updatedAt: new Date(),
          chatId: id,
        },
      ];

      await this.messageRepo.insertMany(newMessages);
    }

    pipeDataStreamToResponse(res, {
      execute: async (dataStreamWriter) => {
        dataStreamWriter.writeData('initialized call');

        const result = streamText({
          model: customModel(model.apiIdentifier),
          system: systemInstruction ?? systemPrompt,
          messages: coreMessages,
          tools: {
            getWeather: {
              description: 'Get the current weather at a location',
              parameters: z.object({
                latitude: z.number().describe('Latitude coordinate'),
                longitude: z.number().describe('Longitude coordinate'),
              }),
              execute: async ({ latitude, longitude }) => {
                const response = await fetch(
                  `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`,
                );

                const weatherData = await response.json();
                return weatherData;
              },
            },
            // displayFlightStatus: {
            //   description: 'Display the status of a flight',
            //   parameters: z.object({
            //     flightNumber: z.string().describe('Flight number'),
            //     date: z.string().describe('Date of the flight'),
            //   }),
            //   execute: async ({ flightNumber, date }) => {
            //     const flightStatus = await generateSampleFlightStatus({
            //       flightNumber,
            //       date,
            //     });

            //     return flightStatus;
            //   },
            // },
            // searchFlights: {
            //   description: 'Search for flights based on the given parameters',
            //   parameters: z.object({
            //     origin: z.string().describe('Origin airport or city'),
            //     destination: z.string().describe('Destination airport or city'),
            //   }),
            //   execute: async ({ origin, destination }) => {
            //     const results = await generateSampleFlightSearchResults({
            //       origin,
            //       destination,
            //     });

            //     return results;
            //   },
            // },
            // selectSeats: {
            //   description: 'Select seats for a flight',
            //   parameters: z.object({
            //     flightNumber: z.string().describe('Flight number'),
            //   }),
            //   execute: async ({ flightNumber }) => {
            //     const seats = await generateSampleSeatSelection({
            //       flightNumber,
            //     });
            //     return seats;
            //   },
            // },
            // createReservation: {
            //   description: 'Display pending reservation details',
            //   parameters: z.object({
            //     seats: z
            //       .string()
            //       .array()
            //       .describe('Array of selected seat numbers'),
            //     flightNumber: z.string().describe('Flight number'),
            //     departure: z.object({
            //       cityName: z.string().describe('Name of the departure city'),
            //       airportCode: z
            //         .string()
            //         .describe('Code of the departure airport'),
            //       timestamp: z.string().describe('ISO 8601 date of departure'),
            //       gate: z.string().describe('Departure gate'),
            //       terminal: z.string().describe('Departure terminal'),
            //     }),
            //     arrival: z.object({
            //       cityName: z.string().describe('Name of the arrival city'),
            //       airportCode: z
            //         .string()
            //         .describe('Code of the arrival airport'),
            //       timestamp: z.string().describe('ISO 8601 date of arrival'),
            //       gate: z.string().describe('Arrival gate'),
            //       terminal: z.string().describe('Arrival terminal'),
            //     }),
            //     passengerName: z.string().describe('Name of the passenger'),
            //   }),
            //   execute: async (props) => {
            //     const { totalPriceInUSD } =
            //       await generateReservationPrice(props);
            //     const session = await auth();

            //     const id = generateUUID();

            //     if (session && session.user && session.user.id) {
            //       await createReservation({
            //         id,
            //         userId: session.user.id,
            //         details: { ...props, totalPriceInUSD },
            //       });

            //       return { id, ...props, totalPriceInUSD };
            //     } else {
            //       return {
            //         error: 'User is not signed in to perform this action!',
            //       };
            //     }
            //   },
            // },
            // authorizePayment: {
            //   description:
            //     'User will enter credentials to authorize payment, wait for user to repond when they are done',
            //   parameters: z.object({
            //     reservationId: z
            //       .string()
            //       .describe('Unique identifier for the reservation'),
            //   }),
            //   execute: async ({ reservationId }) => {
            //     return { reservationId };
            //   },
            // },
            // verifyPayment: {
            //   description: 'Verify payment status',
            //   parameters: z.object({
            //     reservationId: z
            //       .string()
            //       .describe('Unique identifier for the reservation'),
            //   }),
            //   execute: async ({ reservationId }) => {
            //     const reservation = await getReservationById({
            //       id: reservationId,
            //     });

            //     if (reservation.hasCompletedPayment) {
            //       return { hasCompletedPayment: true };
            //     } else {
            //       return { hasCompletedPayment: false };
            //     }
            //   },
            // },
            // displayBoardingPass: {
            //   description: 'Display a boarding pass',
            //   parameters: z.object({
            //     reservationId: z
            //       .string()
            //       .describe('Unique identifier for the reservation'),
            //     passengerName: z
            //       .string()
            //       .describe('Name of the passenger, in title case'),
            //     flightNumber: z.string().describe('Flight number'),
            //     seat: z.string().describe('Seat number'),
            //     departure: z.object({
            //       cityName: z.string().describe('Name of the departure city'),
            //       airportCode: z
            //         .string()
            //         .describe('Code of the departure airport'),
            //       airportName: z
            //         .string()
            //         .describe('Name of the departure airport'),
            //       timestamp: z.string().describe('ISO 8601 date of departure'),
            //       terminal: z.string().describe('Departure terminal'),
            //       gate: z.string().describe('Departure gate'),
            //     }),
            //     arrival: z.object({
            //       cityName: z.string().describe('Name of the arrival city'),
            //       airportCode: z
            //         .string()
            //         .describe('Code of the arrival airport'),
            //       airportName: z
            //         .string()
            //         .describe('Name of the arrival airport'),
            //       timestamp: z.string().describe('ISO 8601 date of arrival'),
            //       terminal: z.string().describe('Arrival terminal'),
            //       gate: z.string().describe('Arrival gate'),
            //     }),
            //   }),
            //   execute: async (boardingPass) => {
            //     return boardingPass;
            //   },
            // },
          },
          onFinish: async ({ response }) => {
            if (userId) {
              const responseMessagesWithoutIncompleteToolCalls =
                sanitizeResponseMessages(response.messages);

              await this.messageRepo.insertMany(
                responseMessagesWithoutIncompleteToolCalls.map((message) => {
                  const messageId = v7();

                  if (message.role === 'assistant') {
                    dataStreamWriter.writeMessageAnnotation({
                      messageIdFromServer: messageId,
                    });
                  }

                  return {
                    id: messageId,
                    chatId: id,
                    role: message.role,
                    content: message.content,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  };
                }),
              );
            }

            if (promptId) {
              await this.promptService.increaseUsageCount(promptId);
            }
          },
          experimental_telemetry: {
            isEnabled: true,
            functionId: 'stream-text',
          },
        });

        result.mergeIntoDataStream(dataStreamWriter, {
          sendReasoning: true,
        });
      },
      onError: (error) => {
        console.error(error);
        return `An error occurred`;
      },
    });
  }

  async remove(chatId: string, userId: string): Promise<void> {
    const existedChat = await this.chatRepo.findById(chatId);

    if (!existedChat) {
      throw AppError.from(ErrChatNotFound, 404);
    }

    if (existedChat.userId !== userId) {
      throw AppError.from(ErrForbidden, 403);
    }

    await this.messageRepo.deleteManyByChatId(chatId);
    await this.chatRepo.delete(chatId);
  }
}
