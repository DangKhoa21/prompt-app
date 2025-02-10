import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { JwtAuthGuard } from 'src/common/guard';
import { TagDTO, TagsToPromptDTO } from './model';
import { ReqWithRequester } from 'src/shared';

@Controller()
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get('tags')
  async getTags() {
    const data = await this.tagService.getTags();
    return { data };
  }

  @Post('tags')
  @UseGuards(JwtAuthGuard)
  // should check only admin role
  async createTag(@Body() dto: TagDTO) {
    const data = await this.tagService.createTag(dto);
    return { data };
  }

  @Delete('tags/:id')
  @UseGuards(JwtAuthGuard)
  // should check only admin role
  async deleteTag(@Param('id') id: string) {
    await this.tagService.deleteTag(id);
    return { data: true };
  }

  @Get('prompts/:id/tags')
  async getTagsOfPrompt(@Param('id') id: string) {
    const data = await this.tagService.getTagsOfPrompt(id);
    return { data };
  }

  @Post('prompts/:id/tags')
  @UseGuards(JwtAuthGuard)
  async addTagsToPrompt(
    @Req() req: ReqWithRequester,
    @Param('id') id: string,
    @Body() dto: TagsToPromptDTO[],
  ) {
    const { sub: creatorId } = req.user;
    await this.tagService.addTagsToPrompt(id, dto, creatorId);
    return { data: true };
  }

  @Put('prompts/:id/tags')
  @UseGuards(JwtAuthGuard)
  async updateTagsOfPrompt(
    @Req() req: ReqWithRequester,
    @Param('id') id: string,
    @Body() dto: TagsToPromptDTO[],
  ) {
    const { sub: creatorId } = req.user;
    await this.tagService.updateTagsOfPrompt(id, dto, creatorId);
    return { data: true };
  }
}
