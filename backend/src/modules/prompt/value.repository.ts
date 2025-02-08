import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/processors/database/prisma.service';
import { ConfigValue, ConfigValueUpdateDTO } from './model';

@Injectable()
export class ConfigValueRepository {
  constructor(private readonly prisma: PrismaService) {}

  async insertMany(values: ConfigValue[]): Promise<void> {
    await this.prisma.configValue.createMany({
      data: values,
    });
  }

  async updateMany(values: ConfigValueUpdateDTO[]): Promise<void> {
    // this is not optimized since we are updating one by one
    await this.prisma.$transaction(
      values.map((value) =>
        this.prisma.configValue.update({
          where: { id: value.id },
          data: value,
        }),
      ),
    );
  }

  async deleteMany(ids: string[]): Promise<void> {
    await this.prisma.configValue.deleteMany({
      where: { id: { in: ids } },
    });
  }
}
