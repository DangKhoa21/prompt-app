import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/processors/database/prisma.service';
import { User, UserCondDTO, UserUpdateDTO } from './model';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async insert(user: User): Promise<void> {
    await this.prisma.user.create({
      data: user,
    });
  }

  async findByCond(condition: UserCondDTO): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: condition,
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, user: UserUpdateDTO): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: user,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
