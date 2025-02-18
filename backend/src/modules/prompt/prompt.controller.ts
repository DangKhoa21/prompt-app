import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PromptService } from './prompt.service';
import {
  PromptWithConfigsCreationDTO,
  PromptWithConfigsUpdateDTO,
} from './model';
import { JwtAuthGuard } from 'src/common/guard';
import { ReqWithRequester } from 'src/shared';

@Controller('prompts')
export class PromptController {
  constructor(private readonly promptService: PromptService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Request() req: ReqWithRequester,
    @Body() dto: PromptWithConfigsCreationDTO,
  ) {
    const { sub: userId } = req.user;
    const data = await this.promptService.create(dto, userId);
    return { data };
  }

  @Get()
  async findAll() {
    const data = await this.promptService.findAll();
    return { data };
  }

  @Get('templates')
  @UseGuards(JwtAuthGuard)
  async findAllByUser(@Request() req: ReqWithRequester) {
    const { sub: userId } = req.user;
    const data = await this.promptService.findByUserWithConfigs(userId);
    return { data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.promptService.findOne(id);
    return { data };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Request() req: ReqWithRequester,
    @Param('id') id: string,
    @Body() dto: PromptWithConfigsUpdateDTO,
  ) {
    const { sub: userId } = req.user;
    await this.promptService.update(id, dto, userId);
    return { data: true };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Request() req: ReqWithRequester, @Param('id') id: string) {
    const { sub: userId } = req.user;
    await this.promptService.remove(id, userId);
    return { data: true };
  }
}
