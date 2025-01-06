import { Injectable } from '@nestjs/common';
import { PromptRepository } from './prompt.repository';
import {
  Prompt,
  PromptCreationDTO,
  promptCreationDTOSchema,
  PromptUpdateDTO,
  promptUpdateDTOSchema,
} from './model';
import { v7 } from 'uuid';

@Injectable()
export class PromptService {
  constructor(private readonly promptRepo: PromptRepository) {}

  async create(dto: PromptCreationDTO): Promise<string> {
    const data = promptCreationDTOSchema.parse(dto);

    const existedPrompt = await this.promptRepo.findByCond({
      title: data.title,
    });

    if (existedPrompt) {
      throw new Error('Prompt already exists');
    }

    //TODO: check for creatorId

    const newId = v7();
    const prompt: Prompt = {
      id: newId,
      title: data.title,
      description: data.description,
      stringTemplate: data.stringTemplate,
      creatorId: data.creatorId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.promptRepo.insert(prompt);

    return newId;
  }

  async findAll(): Promise<Prompt[]> {
    return this.promptRepo.findAll();
  }

  async findOne(id: string): Promise<Prompt> {
    const prompt = await this.promptRepo.findById(id);
    if (!prompt) {
      throw new Error('Prompt not found');
    }
    return prompt;
  }

  async update(id: string, dto: PromptUpdateDTO): Promise<void> {
    const data = promptUpdateDTOSchema.parse(dto);

    const existedPrompt = await this.promptRepo.findById(id);

    if (!existedPrompt) {
      throw new Error('Prompt not found');
    }

    await this.promptRepo.update(id, data);
  }

  async remove(id: string): Promise<void> {
    const existedPrompt = await this.promptRepo.findById(id);

    if (!existedPrompt) {
      throw new Error('Prompt not found');
    }

    await this.promptRepo.delete(id);
  }
}
