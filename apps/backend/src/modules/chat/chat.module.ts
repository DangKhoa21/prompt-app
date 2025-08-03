import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/processors/database/prisma.module';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatRepository } from './chat.repository';
import { MessageRepository } from './message.repository';
import { PromptModule } from '../prompt/prompt.module';

@Module({
  imports: [PrismaModule, PromptModule],
  controllers: [ChatController],
  providers: [ChatService, ChatRepository, MessageRepository],
})
export class ChatModule {}
