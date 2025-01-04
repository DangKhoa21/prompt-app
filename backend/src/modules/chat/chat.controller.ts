import { Body, Controller, Post, Res } from '@nestjs/common';
import { pipeDataStreamToResponse, streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { Response } from 'express';

@Controller('chat')
export class ChatController {
  @Post()
  async streamResponse(@Body() data, @Res() res: Response) {
    const { messages, modelId } = data;

    pipeDataStreamToResponse(res, {
      execute: async (dataStreamWriter) => {
        dataStreamWriter.writeData('initialized call');
        const result = streamText({
          model: google(modelId),
          messages,
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
