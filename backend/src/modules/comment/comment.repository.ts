import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/processors/database/prisma.service';
import {
  Comment,
  CommentCard,
  CommentCondDTO,
  CommentUpdateDTO,
} from './model';
import { Paginated, PagingDTO } from 'src/shared';

@Injectable()
export class CommentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Comment | null> {
    return this.prisma.comment.findUnique({
      where: { id },
    });
  }

  async list(
    paging: PagingDTO,
    dto: CommentCondDTO,
  ): Promise<Paginated<CommentCard>> {
    const { cursor, limit } = paging;
    const { promptId, parentId } = dto;

    let where = {};
    if (promptId) {
      where = { ...where, promptId };
    }
    if (parentId !== undefined) {
      where = { ...where, parentId };
    }

    const data: CommentCard[] = await this.prisma.comment.findMany({
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { id: 'desc' },
      where,
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    });

    const nextCursor = data.length > 0 ? data[data.length - 1].id : undefined;

    return { data, nextCursor };
  }

  async insert(comment: Comment): Promise<void> {
    await this.prisma.comment.create({
      data: comment,
    });
  }

  async update(id: string, data: CommentUpdateDTO): Promise<void> {
    await this.prisma.comment.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.comment.delete({
      where: { id },
    });
  }
}
