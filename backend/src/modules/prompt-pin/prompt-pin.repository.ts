import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/processors/database/prisma.service';
import { PromptPin } from './model';

@Injectable()
export class PromptPinRepository {
  constructor(private readonly prisma: PrismaService) {}

  async insert(promptPin: PromptPin): Promise<void> {
    await this.prisma.promptPin.create({
      data: promptPin,
    });
  }

  async findOne(userId: string, promptId: string): Promise<PromptPin | null> {
    return this.prisma.promptPin.findUnique({
      where: {
        userId_promptId: { userId, promptId },
      },
    });
  }

  async findPromptPinsByUserId(userId: string): Promise<PromptPin[]> {
    return this.prisma.promptPin.findMany({
      where: {
        userId,
      },
    });
  }

  async delete(promptPin: PromptPin): Promise<void> {
    await this.prisma.promptPin.delete({
      where: {
        userId_promptId: {
          userId: promptPin.userId,
          promptId: promptPin.promptId,
        },
      },
    });
  }
}
