import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { SendMessageDTO } from './model';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('history')
  // add guard
  async getHistory() {
    // extract user id from jwt
    const id = '01946afc-c8fd-743f-a5dd-5874796acd67';
    const data = await this.chatService.findByUserId(id);
    return { data };
  }

  @Get(':id/messages')
  async getMessages(@Param('id') id: string) {
    const data = await this.chatService.findMessagesByChatId(id);
    return { data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.chatService.findById(id);
    return { data };
  }

  @Post()
  // add guard
  async streamResponse(@Body() dto: SendMessageDTO, @Res() res: Response) {
    await this.chatService.streamResponse(dto, res);
  }
}
