import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/processors/database/prisma.service';
import { Message } from './model';

@Injectable()
export class MessageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async insertMany(messages: Message[]) {
    const messagesToDB = messages.map((message) => ({
      ...message,
      content: JSON.stringify(message.content), // ensure correct typing
    }));

    return this.prisma.message.createMany({
      data: messagesToDB,
    });
  }
}
