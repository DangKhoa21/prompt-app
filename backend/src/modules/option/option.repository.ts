import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/processors/database/prisma.service';
import { Option, OptionCondDTO } from './model';

@Injectable()
export class OptionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async insert(option: Option): Promise<void> {
    await this.prisma.option.create({
      data: option,
    });
  }

  async findOne(id: string): Promise<Option | null> {
    return this.prisma.option.findUnique({
      where: { id },
    });
  }

  async findByCond(cond: OptionCondDTO): Promise<Option | null> {
    return this.prisma.option.findFirst({
      where: cond,
    });
  }
}
