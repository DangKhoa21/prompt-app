import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/processors/database/prisma.service';
import {
  Prompt,
  PromptCard,
  PromptCondDTO,
  PromptUpdateDTO,
  PromptWithConfigs,
} from './model';

@Injectable()
export class PromptRepository {
  constructor(private readonly prisma: PrismaService) {}

  async insert(prompt: Prompt): Promise<void> {
    await this.prisma.prompt.create({
      data: prompt,
    });
  }

  async findByCond(condition: PromptCondDTO): Promise<Prompt | null> {
    return this.prisma.prompt.findFirst({
      where: condition,
    });
  }

  async findById(id: string): Promise<Prompt | null> {
    return this.prisma.prompt.findUnique({
      where: { id },
    });
  }

  async findByIdWithConfigs(id: string): Promise<PromptWithConfigs | null> {
    return this.prisma.prompt.findUnique({
      where: { id },
      include: {
        configs: {
          include: {
            values: true,
          },
        },
      },
    });
  }

  async findAll(): Promise<PromptCard[]> {
    return this.prisma.prompt.findMany({
      include: {
        creator: {
          select: {
            id: true,
            username: true,
          },
        },
        stars: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
    });
  }

  async update(id: string, prompt: PromptUpdateDTO): Promise<void> {
    await this.prisma.prompt.update({
      where: { id },
      data: prompt,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.prompt.delete({
      where: { id },
    });
  }
}
