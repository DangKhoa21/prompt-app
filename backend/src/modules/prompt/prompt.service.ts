import { Injectable } from '@nestjs/common';
import { PromptRepository } from './prompt.repository';
import {
  ErrPromptExisted,
  ErrPromptNotFound,
  Prompt,
  PromptCreationDTO,
  promptCreationDTOSchema,
  PromptUpdateDTO,
  promptUpdateDTOSchema,
  PromptWithConfigs,
} from './model';
import { v7 } from 'uuid';
import { AppError, ErrForbidden } from 'src/shared';

@Injectable()
export class PromptService {
  constructor(private readonly promptRepo: PromptRepository) {}

  async create(dto: PromptCreationDTO, creatorId: string): Promise<string> {
    const data = promptCreationDTOSchema.parse(dto);

    const existedPrompt = await this.promptRepo.findByCond({
      title: data.title,
    });

    if (existedPrompt) {
      throw AppError.from(ErrPromptExisted, 400);
    }

    const newId = v7();
    const prompt: Prompt = {
      id: newId,
      title: data.title,
      description: data.description,
      stringTemplate: data.stringTemplate,
      creatorId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.promptRepo.insert(prompt);

    return newId;
  }

  async findAll(): Promise<Prompt[]> {
    return this.promptRepo.findAll();
  }

  async findOne(id: string): Promise<PromptWithConfigs> {
    const prompt = await this.promptRepo.findByIdWithConfigs(id);
    if (!prompt) {
      throw AppError.from(ErrPromptNotFound, 400);
    }
    return prompt;
  }

  async update(
    id: string,
    dto: PromptUpdateDTO,
    creatorId: string,
  ): Promise<void> {
    const data = promptUpdateDTOSchema.parse(dto);

    const existedPrompt = await this.promptRepo.findById(id);

    if (!existedPrompt) {
      throw AppError.from(ErrPromptNotFound, 400);
    }

    if (existedPrompt.creatorId !== creatorId) {
      throw AppError.from(ErrForbidden, 403);
    }

    await this.promptRepo.update(id, data);
  }

  async remove(id: string, creatorId: string): Promise<void> {
    const existedPrompt = await this.promptRepo.findById(id);

    if (!existedPrompt) {
      throw AppError.from(ErrPromptNotFound, 400);
    }

    if (existedPrompt.creatorId !== creatorId) {
      throw AppError.from(ErrForbidden, 403);
    }

    await this.promptRepo.delete(id);
  }
}
