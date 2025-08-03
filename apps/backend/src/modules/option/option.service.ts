import { Injectable } from '@nestjs/common';
import {
  ErrOptionNotFound,
  OptionCreateDTO,
  optionCreateSchema,
  Option,
} from './model';
import { OptionRepository } from './option.repository';
import { AppError } from 'src/shared';
import { v7 } from 'uuid';

@Injectable()
export class OptionService {
  constructor(private readonly optionRepo: OptionRepository) {}

  async create(dto: OptionCreateDTO): Promise<string> {
    const data = optionCreateSchema.parse(dto);

    // if the option string already exists
    const existedOption = await this.optionRepo.findByCond(data);
    if (existedOption) {
      return existedOption.id;
    }

    const newOption: Option = {
      id: v7(),
      option: data.option,
    };
    await this.optionRepo.insert(newOption);

    return newOption.id;
  }

  async findOne(id: string): Promise<Option> {
    const option = await this.optionRepo.findOne(id);
    if (!option) {
      throw AppError.from(ErrOptionNotFound, 404);
    }
    return option;
  }
}
