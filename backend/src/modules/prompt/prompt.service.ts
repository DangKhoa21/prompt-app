import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { RedisService } from 'src/processors/redis/redis.service';
import { PromptRepository } from './prompt.repository';
import { PromptConfigRepository } from './config.repository';
import { ConfigValueRepository } from './value.repository';
import { TagService } from '../tag/tag.service';
import { StarService } from '../star/star.service';
import { PromptPinService } from '../prompt-pin/prompt-pin.service';
import {
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
  PromptCondDTO,
  PromptCardRepo,
  TemplateCard,
  PromptUpdateResultDTO,
  promptUpdateResultDTOSchema,
  PromptStats,
} from './model';
import {
  AppError,
  ErrForbidden,
  Paginated,
  PagingDTO,
  pagingDTOSchema,
  PromptFilterDTO,
  promptFilterDTOSchema,
} from 'src/shared';

@Injectable()
export class PromptService {
  constructor(
    private readonly promptRepo: PromptRepository,
    private readonly configRepo: PromptConfigRepository,
    private readonly valueRepo: ConfigValueRepository,
    @Inject(forwardRef(() => TagService))
    private readonly tagService: TagService,
    @Inject(forwardRef(() => StarService))
    private readonly starService: StarService,
    @Inject(forwardRef(() => PromptPinService))
    private readonly promptPinService: PromptPinService,
    private readonly redisService: RedisService,
  ) {}

  async create(
    dto: PromptWithConfigsCreationDTO,
    creatorId: string,
  ): Promise<string> {
    const data = promptWithConfigsCreationDTOSchema.parse(dto);

    const prompt: Prompt = {
      id: data.id,
      title: data.title,
      description: data.description,
      stringTemplate: data.stringTemplate,
      systemInstruction: data.systemInstruction ?? null,
      usageCount: 0,
      viewCount: 0,
      creatorId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const configs: PromptConfig[] = data.configs.map((config) => ({
      id: config.id,
      label: config.label,
      type: config.type,
      info: config.info,
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

  async findAll(
    userId: string | null,
    pagingDTO: PagingDTO,
    filterDTO: PromptFilterDTO,
  ): Promise<Paginated<PromptCard>> {
    const paging = pagingDTOSchema.parse(pagingDTO);
    const filter = promptFilterDTOSchema.parse(filterDTO);

    const promptIdsByTagId = filter.tagId
      ? await this.tagService.findPromptIdsByTagId(filter.tagId)
      : undefined;

    const { data: promptCardsRepo, nextCursor } = await this.promptRepo.list(
      paging,
      {
        promptIds: promptIdsByTagId,
        creatorId: filter.creatorId,
        search: filter.search,
        sort: filter.sort,
      },
    );

    // track if requester has starred a prompt
    const hasStarredMap: Record<string, boolean> = {};

    if (userId) {
      promptCardsRepo.forEach((prompt) => {
        // hasStarredMap[prompt.id] = true if prompt stars list includes userId
        hasStarredMap[prompt.id] = prompt.stars.some(
          (star) => star.userId === userId,
        );
      });
    }

    const promptCards = promptCardsRepo.map(({ stars, ...rest }) => {
      return {
        ...rest,
        hasStarred: hasStarredMap[rest.id] === true,
        starCount: stars.length,
      };
    });

    return { data: promptCards, nextCursor };
  }

  async findOne(id: string): Promise<PromptWithConfigs> {
    const prompt = await this.promptRepo.findByIdWithConfigs(id);
    if (!prompt) {
      throw AppError.from(ErrPromptNotFound, 404);
    }
    return prompt;
  }

  async findStats(
    userId: string | null,
    promptId: string,
  ): Promise<PromptStats> {
    const data = await this.promptRepo.findByIdWithStats(promptId);
    if (!data) {
      throw AppError.from(ErrPromptNotFound, 404);
    }

    const hasStarred = userId
      ? data.stars.some((star) => star.userId === userId)
      : false;

    const result: PromptStats = {
      hasStarred,
      starCount: data.stars.length,
      commentCount: data.comments.length,
    };

    return result;
  }

  async list(
    paging: PagingDTO,
    cond: PromptCondDTO,
  ): Promise<Paginated<PromptCardRepo>> {
    return this.promptRepo.list(paging, cond);
  }

  async findByUserWithConfigs(userId: string): Promise<TemplateCard[]> {
    return this.promptRepo.findByUserWithConfigs(userId);
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
      systemInstruction: data.systemInstruction ?? null,
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
        info: config.info,
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
        info: config.info,
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

  async updateResult(
    id: string,
    dto: PromptUpdateResultDTO,
    creatorId: string,
  ): Promise<void> {
    const data = promptUpdateResultDTOSchema.parse(dto);

    const existedPrompt = await this.promptRepo.findByIdWithConfigs(id);

    if (!existedPrompt) {
      throw AppError.from(ErrPromptNotFound, 400);
    }

    if (existedPrompt.creatorId !== creatorId) {
      throw AppError.from(ErrForbidden, 403);
    }

    const prompt: PromptUpdateResultDTO = {
      exampleResult: data.exampleResult,
      updatedAt: new Date(),
    };

    await this.promptRepo.updateResult(id, prompt);
  }

  async increaseUsageCount(id: string): Promise<void> {
    const existedPrompt = await this.promptRepo.findByIdWithConfigs(id);

    if (!existedPrompt) {
      throw AppError.from(ErrPromptNotFound, 400);
    }

    await this.promptRepo.increaseUsageCount(id);
  }

  async viewPrompt(promptId: string, userIp: string): Promise<void> {
    const existedPrompt = await this.promptRepo.findByIdWithConfigs(promptId);

    if (!existedPrompt) {
      throw AppError.from(ErrPromptNotFound, 400);
    }

    // cache the userIp
    const cacheKey = `prompt:${promptId}:viewed:${userIp}`;
    const cached = await this.redisService.getCache<boolean>(cacheKey);

    if (cached) {
      // if the user has already viewed this prompt, do nothing
      return;
    }

    // update view count
    await this.promptRepo.increaseViewCount(promptId);
    // cache the view for 24 hours
    await this.redisService.setCache(cacheKey, true, 24 * 60 * 60);
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

    //not the best approach
    await this.tagService.updateTagsOfPrompt(id, { tagIds: [] }, creatorId);
    try {
      await this.starService.unstar(id, creatorId);
    } catch (error) {
      console.log(error); // really not
    }
    try {
      await this.promptPinService.unpin(id, creatorId);
    } catch (error) {
      console.log(error); // really not
    }

    await this.promptRepo.delete(id);
  }
}
