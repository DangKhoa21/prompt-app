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

  async findByUserId(userId: string): Promise<Chat[]> {
    return this.prisma.chat.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<Chat | null> {
    return this.prisma.chat.findUnique({
      where: { id },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.chat.delete({
      where: { id },
    });
  }
}
