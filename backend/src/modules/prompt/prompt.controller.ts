import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PromptService } from './prompt.service';
import { PromptCreationDTO, PromptUpdateDTO } from './model';

@Controller('prompts')
export class PromptController {
  constructor(private readonly promptService: PromptService) {}

  @Post()
  async create(@Body() dto: PromptCreationDTO) {
    const data = await this.promptService.create(dto);
    return { data };
  }

  @Get()
  async findAll() {
    const data = await this.promptService.findAll();
    return { data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.promptService.findOne(id);
    return { data };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: PromptUpdateDTO) {
    await this.promptService.update(id, dto);
    return { data: true };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.promptService.remove(id);
    return { data: true };
  }
}
