import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PromptService } from './prompt.service';
import {
  PromptFilterDTO,
  PromptWithConfigsCreationDTO,
  PromptWithConfigsUpdateDTO,
} from './model';
import { JwtAuthGuard, JwtAuthGuardOptional } from 'src/common/guard';
import { PagingDTO, ReqWithRequester, ReqWithRequesterOpt } from 'src/shared';

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
  @UseGuards(JwtAuthGuardOptional)
  async findAll(
    @Request() req: ReqWithRequesterOpt,
    @Query() pagingDTO: PagingDTO,
    @Query() filterDTO: PromptFilterDTO,
  ) {
    const requester = req.user;
    const userId = requester ? requester.sub : null;
    const result = await this.promptService.findAll(
      userId,
      pagingDTO,
      filterDTO,
    );
    return result;
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
