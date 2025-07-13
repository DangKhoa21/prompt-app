import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/processors/database/prisma.service';
import {
  Prompt,
  PromptCardRepo,
  PromptCondDTO,
  PromptStatsRepo,
  PromptUpdateDTO,
  PromptUpdateResultDTO,
  PromptWithConfigs,
  TemplateCard,
} from './model';
import { Paginated, PagingDTO } from 'src/shared';
import { Prisma } from '@prisma/client';

@Injectable()
export class PromptRepository {
  constructor(private readonly prisma: PrismaService) {}

  async insert(prompt: Prompt): Promise<void> {
    // exampleResult won't be saved when insert
    const { exampleResult, ...data } = prompt;

    await this.prisma.prompt.create({
      data,
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

  async findByIdWithStats(id: string): Promise<PromptStatsRepo | null> {
    return this.prisma.prompt.findUnique({
      where: { id },
      include: {
        stars: {
          select: {
            userId: true,
          },
        },
        comments: {
          select: {
            creatorId: true,
          },
        },
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
            avatarUrl: true,
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
    const { promptIds, creatorId, search, sort } = cond;

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

    let orderBy = {};
    orderBy = { id: sort === 'oldest' ? 'asc' : 'desc' };
    if (sort === 'most-starred') {
      orderBy = { stars: { _count: 'desc' } };
    }

    const data: PromptCardRepo[] = await this.prisma.prompt.findMany({
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy,
      where,
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
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

  async updateResult(id: string, prompt: PromptUpdateResultDTO): Promise<void> {
    await this.prisma.prompt.update({
      where: { id },
      data: {
        exampleResult: prompt.exampleResult
          ? (prompt.exampleResult as Prisma.JsonArray)
          : undefined,
      },
    });
  }

  async increaseUsageCount(id: string): Promise<void> {
    await this.prisma.prompt.update({
      where: { id },
      data: {
        usageCount: {
          increment: 1,
        },
      },
    });
  }

  async increaseViewCount(id: string): Promise<void> {
    await this.prisma.prompt.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.prompt.delete({
      where: { id },
    });
  }
}
