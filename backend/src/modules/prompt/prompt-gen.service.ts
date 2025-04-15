import { Injectable } from '@nestjs/common';
import { streamObject, streamText } from 'ai';
import { Response } from 'express';
import {
  customModel,
  systemAnalyzeImprovePrompt,
  systemEnhancePrompt,
  systemGenerateTemplate,
} from 'src/shared/ai';
import {
  PromptGenDTO,
  promptGenDTOSchema,
  promptWithConfigGenSchema,
} from './model';

@Injectable()
export class PromptGenService {
  constructor() {}

  async generateTemplate(dto: PromptGenDTO, res: Response) {
    const data = promptGenDTOSchema.parse(dto);
    const { prompt } = data;

    const result = streamObject({
      model: customModel('gemini-1.5-flash-002'),
      system: systemGenerateTemplate,
      schema: promptWithConfigGenSchema,
      prompt,
      onError: (error) => console.error(error),
    });

    return result.pipeTextStreamToResponse(res);
  }

  async enhancePrompt(dto: PromptGenDTO, res: Response) {
    const data = promptGenDTOSchema.parse(dto);
    const { prompt } = data;

    const result = streamText({
      model: customModel('gemini-1.5-flash-002'),
      system: systemEnhancePrompt,
      prompt,
      onError: (error) => console.error(error),
    });

    return result.pipeTextStreamToResponse(res);
  }

  async generatePromptResult(dto: PromptGenDTO, res: Response) {
    const data = promptGenDTOSchema.parse(dto);
    const { prompt } = data;

    const result = streamText({
      model: customModel('gemini-1.5-flash-002'),
      prompt,
      system:
        'Please generate the following content in full, ensuring that the output is complete and not truncated. Continue until the end. Do not summarize or stop early.',
      onError: (error) => console.error(error),
    });

    return result.pipeTextStreamToResponse(res);
  }

  async evaluatePrompt(dto: PromptGenDTO, res: Response) {
    const data = promptGenDTOSchema.parse(dto);
    const { prompt } = data;

    const result = streamText({
      model: customModel('gemini-1.5-flash-002'),
      system: systemAnalyzeImprovePrompt,
      prompt,
      onError: (error) => console.error(error),
    });

    return result.pipeTextStreamToResponse(res);
  }
}
