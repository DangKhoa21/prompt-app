import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { OptionService } from './option.service';
import { OptionCreateDTO } from './model';

@Controller('option')
export class OptionController {
  constructor(private readonly optionService: OptionService) {}

  @Post()
  async create(@Body() dto: OptionCreateDTO) {
    const data = await this.optionService.create(dto);
    return { data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.optionService.findOne(id);
    return { data };
  }
}
