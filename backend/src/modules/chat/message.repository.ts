import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/processors/database/prisma.service';
import { Message } from './model';
import { Prisma } from '@prisma/client';

@Injectable()
export class MessageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async insertMany(messages: Message[]): Promise<void> {
    const messagesToDB = messages.map((message) => ({
      ...message,
      content: message.content as Prisma.JsonArray, // ensure correct typing
    }));

    await this.prisma.message.createMany({
      data: messagesToDB,
    });
  }

  async findByChatId(id: string): Promise<Message[]> {
    return this.prisma.message.findMany({
      where: { chatId: id },
    });
  }

  async deleteManyByChatId(id: string): Promise<void> {
    await this.prisma.message.deleteMany({ where: { chatId: id } });
  }
}
