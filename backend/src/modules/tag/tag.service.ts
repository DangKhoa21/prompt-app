import { Injectable } from '@nestjs/common';
import { TagRepository } from './tag.repository';
import { PromptService } from '../prompt/prompt.service';
import {
  ErrTagExisted,
  ErrTagIsAlreadyAdded,
  ErrTagNotFound,
  PromptTag,
  Tag,
  TagDTO,
  tagDTOSchema,
  TagsToPromptDTO,
  tagsToPromptDTOSchema,
} from './model';
import { v7 } from 'uuid';
import { AppError, ErrForbidden } from 'src/shared';

@Injectable()
export class TagService {
  constructor(
    private readonly tagRepo: TagRepository,
    private readonly promptService: PromptService,
  ) {}

  async getTags(): Promise<Tag[]> {
    return this.tagRepo.findAll();
  }

  async createTag(dto: TagDTO): Promise<string> {
    const data = tagDTOSchema.parse(dto);

    const existedTag = await this.tagRepo.findByCond({ name: data.name });
    if (existedTag) {
      throw AppError.from(ErrTagExisted, 400);
    }

    const newTag: Tag = {
      id: v7(),
      name: data.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.tagRepo.insert(newTag);

    return newTag.id;
  }

  async deleteTag(id: string): Promise<void> {
    const existedTag = await this.tagRepo.findById(id);

    if (!existedTag) {
      throw AppError.from(ErrTagNotFound, 400);
    }

    await this.tagRepo.deletePromptTagsByTagId(id);
    await this.tagRepo.delete(id);
  }

  async getTagsOfPrompt(id: string): Promise<Tag[]> {
    await this.promptService.findOne(id); // check if prompt exists

    const promptTags = await this.tagRepo.findPromptTagsByPromptId(id);
    const tagIds = promptTags.map((tag) => tag.tagId);

    return this.tagRepo.findByIds(tagIds);
  }

  async addTagsToPrompt(
    id: string,
    dto: TagsToPromptDTO[],
    creatorId: string,
  ): Promise<void> {
    const existedPrompt = await this.promptService.findOne(id); // check if prompt exists

    if (existedPrompt.creatorId !== creatorId) {
      throw AppError.from(ErrForbidden, 403);
    }

    const data = tagsToPromptDTOSchema.parse(dto);

    const existedTags = await this.tagRepo.findByIds(data.tagIds);
    // check if all tagIds exist in db or is valid
    if (existedTags.length !== data.tagIds.length) {
      throw AppError.from(ErrTagNotFound, 400);
    }

    const promptTags = await this.tagRepo.findPromptTagsByPromptId(id);
    if (promptTags.length > 0) {
      throw AppError.from(ErrTagIsAlreadyAdded, 400);
    }

    const newPrompTags: PromptTag[] = data.tagIds.map((tagId) => ({
      promptId: id,
      tagId,
    }));

    await this.tagRepo.insertPromptTags(newPrompTags);
  }

  async updateTagsOfPrompt(
    id: string,
    dto: TagsToPromptDTO[],
    creatorId: string,
  ): Promise<void> {
    const existedPrompt = await this.promptService.findOne(id); // check if prompt exists

    if (existedPrompt.creatorId !== creatorId) {
      throw AppError.from(ErrForbidden, 403);
    }

    const data = tagsToPromptDTOSchema.parse(dto);

    const existedTags = await this.tagRepo.findByIds(data.tagIds);
    // check if all tagIds exist in db or is valid
    if (existedTags.length !== data.tagIds.length) {
      throw AppError.from(ErrTagNotFound, 400);
    }

    const promptTags = await this.tagRepo.findPromptTagsByPromptId(id);
    const tagIdsOfPrompt = promptTags.map((tag) => tag.tagId);

    const newPrompTags: PromptTag[] = data.tagIds
      .filter((tagId) => !tagIdsOfPrompt.includes(tagId)) // tagId that is not already added in prompt
      .map((tagId) => ({
        promptId: id,
        tagId,
      }));

    await this.tagRepo.insertPromptTags(newPrompTags);

    const deletedTagIdsOfPrompt = tagIdsOfPrompt.filter(
      (tagId) => !data.tagIds.includes(tagId), // tagId that is no longer in prompt
    );

    await this.tagRepo.deletePromptTagsByPromptIdAndTagIds(
      id,
      deletedTagIdsOfPrompt,
    );
  }
}
