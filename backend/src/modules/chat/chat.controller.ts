import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { SendMessageDTO } from './model';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  // add guard
  async streamResponse(@Body() dto: SendMessageDTO, @Res() res: Response) {
    await this.chatService.streamResponse(dto, res);
  }
}
