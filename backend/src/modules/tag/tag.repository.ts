import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/processors/database/prisma.service';
import { Tag, PromptTag, TagCondDTO } from './model';

@Injectable()
export class TagRepository {
  constructor(private readonly prisma: PrismaService) {}

  async insert(tag: Tag): Promise<void> {
    await this.prisma.tag.create({
      data: tag,
    });
  }

  async insertMany(tags: Tag[]): Promise<void> {
    await this.prisma.tag.createMany({
      data: tags,
    });
  }

  async insertPromptTags(promptTags: PromptTag[]): Promise<void> {
    await this.prisma.promptTag.createMany({
      data: promptTags,
    });
  }

  async findAll(): Promise<Tag[]> {
    return this.prisma.tag.findMany();
  }

  async findById(id: string): Promise<Tag | null> {
    return this.prisma.tag.findUnique({
      where: { id },
    });
  }

  async findByIds(ids: string[]): Promise<Tag[]> {
    return this.prisma.tag.findMany({
      where: { id: { in: ids } },
    });
  }

  async findByCond(cond: TagCondDTO): Promise<Tag | null> {
    return this.prisma.tag.findFirst({
      where: cond,
    });
  }

  async findPromptTagsByPromptId(promptId: string): Promise<PromptTag[]> {
    return this.prisma.promptTag.findMany({
      where: { promptId },
    });
  }

  async findPromptTagsByTagId(tagId: string): Promise<PromptTag[]> {
    return this.prisma.promptTag.findMany({
      where: { tagId },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.tag.delete({
      where: { id },
    });
  }

  async deletePromptTagsByTagId(tagId: string): Promise<void> {
    await this.prisma.promptTag.deleteMany({
      where: { tagId },
    });
  }

  async deletePromptTagsByPromptId(promptId: string): Promise<void> {
    await this.prisma.promptTag.deleteMany({
      where: { promptId },
    });
  }

  async deletePromptTagsByPromptIdAndTagIds(
    promptId: string,
    tagIds: string[],
  ): Promise<void> {
    await this.prisma.promptTag.deleteMany({
      where: { promptId, tagId: { in: tagIds } },
    });
  }
}
