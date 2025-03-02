import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/processors/database/prisma.service';
import {
  Prompt,
  PromptCardRepo,
  PromptCondDTO,
  PromptUpdateDTO,
  PromptWithConfigs,
  TemplateCard,
} from './model';
import { Paginated, PagingDTO } from 'src/shared';

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

  async findByUserWithConfigs(creatorId: string): Promise<TemplateCard[]> {
    return this.prisma.prompt.findMany({
      where: { creatorId },
      include: {
        configs: {
          include: {
            values: true,
          },
        },
        // tags: {
        //   include: {
        //     tag: true,
        //   },
        // },
      },
    });
  }

  async findByIds(ids: string[]): Promise<TemplateCard[]> {
    return this.prisma.prompt.findMany({
      where: { id: { in: ids } },
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
  async list(
    paging: PagingDTO,
    cond: PromptCondDTO,
  ): Promise<Paginated<PromptCardRepo>> {
    const { cursor, limit } = paging;
    const { promptIds, creatorId, search } = cond;

    let where = {};
    if (promptIds) {
      where = { id: { in: promptIds } };
    }
    if (creatorId) {
      where = { ...where, creatorId };
    }
    if (search) {
      where = { ...where, title: { contains: search, mode: 'insensitive' } };
    }

    const data: PromptCardRepo[] = await this.prisma.prompt.findMany({
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: {
        id: 'desc',
      },
      where,
      include: {
        creator: {
          select: {
            id: true,
            username: true,
          },
        },
        stars: {
          select: {
            userId: true,
          },
        },
      },
    });

    const nextCursor = data.length > 0 ? data[data.length - 1].id : undefined;

    return { data, nextCursor };
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
