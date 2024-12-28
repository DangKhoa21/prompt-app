import {
  ChatSession,
  GenerativeModel,
  GoogleGenerativeAI,
} from '@google/generative-ai';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetAIMessageDTO } from './model/get-ai-response.dto';
import { v4 } from 'uuid';

const GEMINI_MODEL = 'gemini-1.5-flash';

@Injectable()
export class GeminiService {
  private readonly googleAI: GoogleGenerativeAI;
  private readonly model: GenerativeModel;
  private chatSessions: { [sessionID: string]: ChatSession } = {};
  private readonly logger = new Logger(GeminiService.name);

  constructor(configService: ConfigService) {
    const geminiAPIKey = configService.get('GOOGLE_GENERATIVE_AI_API_KEY');
    this.googleAI = new GoogleGenerativeAI(geminiAPIKey);
    this.model = this.googleAI.getGenerativeModel({
      model: GEMINI_MODEL,
    });
  }

  private getChatSession(sessionID?: string) {
    const sessionIDToUse = sessionID ?? v4();

    let result = this.chatSessions[sessionIDToUse];

    if (!result) {
      result = this.model.startChat();
      this.chatSessions[sessionIDToUse] = result;
    }

    return {
      sessionID: sessionIDToUse,
      chat: result,
    };
  }

  async generateText(data: GetAIMessageDTO) {
    try {
      console.log(data.prompt, data?.sessionID);
      const { sessionID, chat } = this.getChatSession(data.sessionID);

      const result = await chat.sendMessage(data.prompt);

      return {
        sessionID,
        result: await result.response.text(),
      };
    } catch (error) {
      this.logger.error('Error sending message to Gemini API: ', error);
    }
  }

  async streamText(data: GetAIMessageDTO) {
    try {
      const { sessionID, chat } = this.getChatSession(data.sessionID);

      const result = await chat.sendMessageStream(data.prompt);

      return {
        sessionID,
        result: result.stream,
      };
    } catch (error) {
      this.logger.error('Error sending message to Gemini API: ', error);
    }
  }
}
