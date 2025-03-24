import { Injectable } from '@nestjs/common';
import { streamObject } from 'ai';
import { customModel, systemGeneratePrompt } from 'src/shared/ai';
import {
  PromptGenDTO,
  promptGenDTOSchema,
  promptWithConfigGenSchema,
} from './model';
import { Response } from 'express';

@Injectable()
export class PromptGenService {
  constructor() {}

  async generateTemplate(dto: PromptGenDTO, res: Response) {
    const data = promptGenDTOSchema.parse(dto);
    const { prompt } = data;

    const result = streamObject({
      model: customModel('gemini-1.5-flash-002'),
      system: systemGeneratePrompt,
      schema: promptWithConfigGenSchema,
      prompt,
      onError: (error) => console.error(error),
    });

    return result.pipeTextStreamToResponse(res);
  }
}
