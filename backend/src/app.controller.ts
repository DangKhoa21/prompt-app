import { Controller, Get, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { pipeDataStreamToResponse, streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/')
  async example(@Res() res: Response) {
    const result = streamText({
      model: google('gemini-1.5-flash-002'),
      prompt: 'Hello how are you',
    });

    result.pipeDataStreamToResponse(res);
  }

  @Post('/stream-data')
  async streamData(@Res() res: Response) {
    pipeDataStreamToResponse(res, {
      execute: async (dataStreamWriter) => {
        dataStreamWriter.writeData('initialized call');

        const result = streamText({
          model: google('gemini-1.5-flash-002'),
          prompt: 'Invent a new holiday and describe its traditions.',
        });

        result.mergeIntoDataStream(dataStreamWriter);
      },
      onError: (error) => {
        // Error messages are masked by default for security reasons.
        // If you want to expose the error message to the client, you can do so here:
        return error instanceof Error ? error.message : String(error);
      },
    });
  }
}
