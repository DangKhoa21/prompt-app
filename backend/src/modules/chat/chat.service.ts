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
import { AppError } from 'src/shared';
import {
  customModel,
  generateTitleFromUserMessage,
  getMostRecentUserMessage,
  models,
  sanitizeResponseMessages,
  systemPrompt,
} from 'src/shared/ai';
import { v7 } from 'uuid';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRepo: ChatRepository,
    private readonly messageRepo: MessageRepository,
  ) {}

  async findMessagesByChatId(id: string): Promise<Message[]> {
    return this.messageRepo.findByChatId(id);
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

  async streamResponse(dto: SendMessageDTO, res: Response) {
    const { id, messages, modelId } = dto;

    const model = models.find((model) => model.id === modelId);

    if (!model) {
      throw AppError.from(ErrModelNotFound, 404);
    }

    const coreMessages = convertToCoreMessages(messages);
    const userMessage = getMostRecentUserMessage(coreMessages);

    if (!userMessage) {
      throw AppError.from(ErrUserMessageNotFound, 400);
    }

    const chat = await this.chatRepo.findById(id);

    if (!chat) {
      const title = await generateTitleFromUserMessage({
        message: userMessage,
      });

      const newChat: Chat = {
        id,
        userId: '01946afc-c8fd-743f-a5dd-5874796acd67', // TODO: extract id from jwt
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

    pipeDataStreamToResponse(res, {
      execute: async (dataStreamWriter) => {
        dataStreamWriter.writeData('initialized call');

        const result = streamText({
          model: customModel(model.apiIdentifier),
          system: systemPrompt,
          messages: coreMessages,
          onFinish: async ({ response }) => {
            // TODO: checking if jwt is included, then
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
          },
          experimental_telemetry: {
            isEnabled: true,
            functionId: 'stream-text',
          },
        });

        result.mergeIntoDataStream(dataStreamWriter);
      },
      onError: (error) => {
        console.error(error);
        return `An error occurred`;
      },
    });
  }

  async remove(id: string): Promise<void> {
    const existedChat = await this.chatRepo.findById(id);

    if (!existedChat) {
      throw AppError.from(ErrChatNotFound, 404);
    }

    await this.messageRepo.deleteManyByChatId(id);
    await this.chatRepo.delete(id);
  }
}
