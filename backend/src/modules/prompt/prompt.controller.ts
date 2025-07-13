import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { JwtAuthGuard, JwtAuthGuardOptional } from 'src/common/guard';
import {
  PromptFilterDTO,
  PagingDTO,
  ReqWithRequester,
  ReqWithRequesterOpt,
} from 'src/shared';
import {
  PromptGenDTO,
  PromptUpdateResultDTO,
  PromptWithConfigsCreationDTO,
  PromptWithConfigsUpdateDTO,
} from './model';
import { PromptService } from './prompt.service';
import { PromptGenService } from './prompt-gen.service';
import { Response } from 'express';

@Controller('prompts')
export class PromptController {
  constructor(
    private readonly promptService: PromptService,
    private readonly promptGenService: PromptGenService,
  ) {}

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

  @Post('generate-template')
  @UseGuards(JwtAuthGuard)
  async generateTemplate(@Body() dto: PromptGenDTO, @Res() res: Response) {
    await this.promptGenService.generateTemplate(dto, res);
  }

  @Post('enhance')
  async enhance(@Body() dto: PromptGenDTO, @Res() res: Response) {
    await this.promptGenService.enhancePrompt(dto, res);
  }

  @Post('generate-result')
  async generateResult(@Body() dto: PromptGenDTO, @Res() res: Response) {
    await this.promptGenService.generatePromptResult(dto, res);
  }

  @Post('evaluate')
  async evaluate(@Body() dto: PromptGenDTO, @Res() res: Response) {
    await this.promptGenService.evaluatePrompt(dto, res);
  }

  @Post(':id/view')
  async viewPrompt(@Request() req: ExpressRequest, @Param('id') id: string) {
    let userIp = req.ip;

    if (!userIp) {
      const xff = req.headers['x-forwarded-for'];
      if (Array.isArray(xff)) {
        userIp = xff[0]; // take first IP from array
      } else if (typeof xff === 'string') {
        userIp = xff.split(',')[0].trim(); // take first IP if comma-separated
      }
    }

    if (!userIp) {
      userIp = req.socket.remoteAddress ?? 'unknown';
    }

    await this.promptService.viewPrompt(id, userIp);
    return { data: true };
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

  @Get(':id/stats')
  @UseGuards(JwtAuthGuardOptional)
  async findStats(
    @Request() req: ReqWithRequesterOpt,
    @Param('id') promptId: string,
  ) {
    const requester = req.user;
    const userId = requester ? requester.sub : null;
    const data = await this.promptService.findStats(userId, promptId);
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

  @Patch(':id/result')
  @UseGuards(JwtAuthGuard)
  async updateResult(
    @Request() req: ReqWithRequester,
    @Param('id') id: string,
    @Body() dto: PromptUpdateResultDTO,
  ) {
    const { sub: userId } = req.user;
    await this.promptService.updateResult(id, dto, userId);
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
