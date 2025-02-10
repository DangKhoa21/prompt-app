import { Injectable } from '@nestjs/common';
import { PromptRepository } from './prompt.repository';
import { PromptConfigRepository } from './config.repository';
import { ConfigValueRepository } from './value.repository';
import {
  ErrPromptExisted,
  ErrPromptNotFound,
  Prompt,
  PromptWithConfigsCreationDTO,
  promptWithConfigsCreationDTOSchema,
  PromptWithConfigs,
  PromptConfig,
  PromptUpdateDTO,
  ConfigValue,
  PromptWithConfigsUpdateDTO,
  promptWithConfigsUpdateDTOSchema,
  PromptConfigUpdateDTO,
  ConfigValueUpdateDTO,
  PromptCard,
} from './model';
import { AppError, ErrForbidden } from 'src/shared';

@Injectable()
export class PromptService {
  constructor(
    private readonly promptRepo: PromptRepository,
    private readonly configRepo: PromptConfigRepository,
    private readonly valueRepo: ConfigValueRepository,
  ) {}

  async create(
    dto: PromptWithConfigsCreationDTO,
    creatorId: string,
  ): Promise<string> {
    const data = promptWithConfigsCreationDTOSchema.parse(dto);

    const existedPromptByTitle = await this.promptRepo.findByCond({
      title: data.title,
    });

    const existedPromptById = await this.promptRepo.findById(data.id);

    if (existedPromptByTitle || existedPromptById) {
      throw AppError.from(ErrPromptExisted, 400);
    }

    const prompt: Prompt = {
      id: data.id,
      title: data.title,
      description: data.description,
      stringTemplate: data.stringTemplate,
      creatorId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const configs: PromptConfig[] = data.configs.map((config) => ({
      id: config.id,
      label: config.label,
      type: config.type,
      promptId: prompt.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const values: ConfigValue[] = data.configs.flatMap((config) => {
      return config.values.map((value) => ({
        id: value.id,
        value: value.value,
        promptConfigId: config.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
    });

    await this.promptRepo.insert(prompt);
    await this.configRepo.insertMany(configs); // not handle the case inserting same id or label in configs yet
    await this.valueRepo.insertMany(values); // not handle the case inserting same id or value in values yet

    return data.id;
  }

  async findAll(): Promise<PromptCard[]> {
    return this.promptRepo.findAll();
  }

  async findOne(id: string): Promise<PromptWithConfigs> {
    const prompt = await this.promptRepo.findByIdWithConfigs(id);
    if (!prompt) {
      throw AppError.from(ErrPromptNotFound, 404);
    }
    return prompt;
  }

  async findByIds(ids: string[]): Promise<PromptCard[]> {
    return this.promptRepo.findByIds(ids);
  }

  async update(
    id: string,
    dto: PromptWithConfigsUpdateDTO,
    creatorId: string,
  ): Promise<void> {
    const data = promptWithConfigsUpdateDTOSchema.parse(dto);

    const existedPrompt = await this.promptRepo.findByIdWithConfigs(id);

    if (!existedPrompt) {
      throw AppError.from(ErrPromptNotFound, 400);
    }

    if (existedPrompt.creatorId !== creatorId) {
      throw AppError.from(ErrForbidden, 403);
    }

    // 1. update prompt separately
    const prompt: PromptUpdateDTO = {
      title: data.title,
      description: data.description,
      stringTemplate: data.stringTemplate,
      updatedAt: new Date(),
    };

    await this.promptRepo.update(id, prompt);

    // 2. update configs
    const existedConfigIds = existedPrompt.configs.map((config) => config.id);

    const updatedConfigs: PromptConfigUpdateDTO[] = data.configs
      .filter((config) => {
        return existedConfigIds.includes(config.id); // update configs that exist
      })
      .map((config) => ({
        id: config.id,
        label: config.label,
        type: config.type,
        updatedAt: new Date(),
      }));

    await this.configRepo.updateMany(updatedConfigs);

    // 3. insert new configs
    const newConfigs: PromptConfig[] = data.configs
      .filter((config) => {
        return !existedConfigIds.includes(config.id); // insert new configs that don't exist
      })
      .map((config) => ({
        id: config.id,
        label: config.label,
        type: config.type,
        promptId: id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

    await this.configRepo.insertMany(newConfigs);

    // 4. update new values
    const existedValueIds = existedPrompt.configs.flatMap((config) => {
      return config.values.map((value) => value.id);
    });

    const updatedValues: ConfigValueUpdateDTO[] = data.configs.flatMap(
      (config) => {
        return config.values
          .filter((value) => existedValueIds.includes(value.id))
          .map((value) => ({
            id: value.id,
            value: value.value,
            updatedAt: new Date(),
          }));
      },
    );

    await this.valueRepo.updateMany(updatedValues);

    // 5. insert new values
    const newValues: ConfigValue[] = data.configs.flatMap((config) => {
      return config.values
        .filter((value) => !existedValueIds.includes(value.id))
        .map((value) => ({
          id: value.id,
          value: value.value,
          promptConfigId: config.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
    });

    await this.valueRepo.insertMany(newValues);

    // 6. delete values that don't exist
    const dataValueIds = data.configs.flatMap((config) => {
      return config.values.map((value) => value.id);
    });

    const deletedValueIds = existedValueIds.filter((id) => {
      return !dataValueIds.includes(id);
    });

    // values have to be deleted first since they references to configs
    await this.valueRepo.deleteMany(deletedValueIds);

    // 7. delete configs that don't exist
    const dataConfigIds = data.configs.map((config) => config.id);

    const deletedConfigIds = existedConfigIds.filter((id) => {
      return !dataConfigIds.includes(id);
    });

    await this.configRepo.deleteMany(deletedConfigIds);
  }

  async remove(id: string, creatorId: string): Promise<void> {
    const existedPrompt = await this.promptRepo.findByIdWithConfigs(id);

    if (!existedPrompt) {
      throw AppError.from(ErrPromptNotFound, 400);
    }

    if (existedPrompt.creatorId !== creatorId) {
      throw AppError.from(ErrForbidden, 403);
    }

    const existedValueIds = existedPrompt.configs.flatMap((config) => {
      return config.values.map((value) => value.id);
    });

    await this.valueRepo.deleteMany(existedValueIds);

    const existedConfigIds = existedPrompt.configs.map((config) => config.id);

    await this.configRepo.deleteMany(existedConfigIds);

    //not handle deleting tags and stars yet

    await this.promptRepo.delete(id);
  }
}
