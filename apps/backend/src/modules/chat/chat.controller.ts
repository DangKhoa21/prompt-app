import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { SendMessageDTO } from './model';
import { ChatService } from './chat.service';
import { JwtAuthGuard, JwtAuthGuardOptional } from 'src/common/guard';
import { ReqWithRequester, ReqWithRequesterOpt } from 'src/shared';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('history')
  @UseGuards(JwtAuthGuard)
  async getHistory(@Request() req: ReqWithRequester) {
    const { sub: id } = req.user;
    const data = await this.chatService.findByUserId(id);
    return { data };
  }

  @Get(':id/messages')
  @UseGuards(JwtAuthGuard)
  async getMessages(
    @Request() req: ReqWithRequester,
    @Param('id') chatId: string,
  ) {
    const { sub: userId } = req.user;
    const data = await this.chatService.findMessagesByChatId(chatId, userId);
    return { data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.chatService.findById(id);
    return { data };
  }

  @Post()
  @UseGuards(JwtAuthGuardOptional)
  async streamResponse(
    @Request() req: ReqWithRequesterOpt,
    @Body() dto: SendMessageDTO,
    @Res() res: Response,
  ) {
    const userId = req.user ? req.user.sub : null;
    await this.chatService.streamResponse(dto, res, userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Request() req: ReqWithRequester, @Param('id') chatId: string) {
    const { sub: userId } = req.user;
    await this.chatService.remove(chatId, userId);
    return { data: true };
  }
}
