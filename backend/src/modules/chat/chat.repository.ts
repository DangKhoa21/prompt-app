import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/processors/database/prisma.service';
import { Chat } from './model';

@Injectable()
export class ChatRepository {
  constructor(private readonly prisma: PrismaService) {}

  async insert(chat: Chat): Promise<void> {
    await this.prisma.chat.create({
      data: chat,
    });
  }

  async findById(id: string): Promise<Chat | null> {
    return this.prisma.chat.findUnique({
      where: { id },
    });
  }
}
