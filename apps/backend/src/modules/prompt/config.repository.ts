import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/processors/database/prisma.service';
import { PromptConfig, PromptConfigUpdateDTO } from './model';
import { Prisma } from '@prisma/client';

@Injectable()
export class PromptConfigRepository {
  constructor(private readonly prisma: PrismaService) {}

  async insertMany(configs: PromptConfig[]): Promise<void> {
    const configsToDB = configs.map((config) => ({
      ...config,
      info: config.info ? (config.info as Prisma.JsonArray) : Prisma.JsonNull,
    }));

    await this.prisma.promptConfig.createMany({
      data: configsToDB,
    });
  }

  async updateMany(configs: PromptConfigUpdateDTO[]): Promise<void> {
    // this is not optimized since we are updating one by one
    await this.prisma.$transaction(
      configs.map((config) =>
        this.prisma.promptConfig.update({
          where: { id: config.id },
          data: {
            ...config,
            info: config.info
              ? (config.info as Prisma.JsonArray)
              : Prisma.JsonNull,
          },
        }),
      ),
    );
  }

  async deleteMany(ids: string[]): Promise<void> {
    await this.prisma.promptConfig.deleteMany({
      where: { id: { in: ids } },
    });
  }
}
