import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/processors/database/prisma.service';
import { Star } from './model';

@Injectable()
export class StarRepository {
  constructor(private readonly prisma: PrismaService) {}

  async insert(star: Star): Promise<void> {
    await this.prisma.star.create({
      data: star,
    });
  }

  async findOne(userId: string, promptId: string): Promise<Star | null> {
    return this.prisma.star.findUnique({
      where: {
        userId_promptId: { userId, promptId },
      },
    });
  }

  async findStarsByUserId(userId: string): Promise<Star[]> {
    return this.prisma.star.findMany({
      where: {
        userId,
      },
    });
  }

  async delete(star: Star): Promise<void> {
    await this.prisma.star.delete({
      where: {
        userId_promptId: { userId: star.userId, promptId: star.promptId },
      },
    });
  }
}
