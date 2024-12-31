import {
  Body,
  Controller,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { GetAIMessageDTO } from './model/get-ai-response.dto';
import { pipeDataStreamToResponse, streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { Response } from 'express';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly service: GeminiService) {}

  @Post('')
  @UsePipes(new ValidationPipe({ transform: true }))
  getResponse(@Body() data: GetAIMessageDTO) {
    return this.service.generateText(data);
  }

  @Post('stream')
  @UsePipes(new ValidationPipe({ transform: true }))
  async streamResponse(@Body() data: GetAIMessageDTO, @Res() res: Response) {
    pipeDataStreamToResponse(res, {
      execute: async (dataStreamWriter) => {
        dataStreamWriter.writeData('initialized call');
        const result = streamText({
          model: google('gemini-1.5-flash-002'),
          prompt: data.prompt,
        });

        result.mergeIntoDataStream(dataStreamWriter);
      },
      onError: (error) => {
        res.write(
          `event: error\ndata: ${JSON.stringify(error instanceof Error ? error.message : String(error))}\n\n`,
        );
        res.end();
        return error instanceof Error ? error.message : String(error);
      },
    });
  }
}
