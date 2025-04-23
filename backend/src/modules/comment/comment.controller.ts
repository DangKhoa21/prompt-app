import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from 'src/common/guard';
import { CommentCreateDTO, CommentUpdateDTO } from './model';
import { PagingDTO, ReqWithRequester, ReqWithRequesterOpt } from 'src/shared';

@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('prompts/:id/comments')
  @UseGuards(JwtAuthGuard)
  async createComment(
    @Param('id') promptId: string,
    @Request() req: ReqWithRequester,
    @Body() dto: CommentCreateDTO,
  ) {
    const { sub: userId } = req.user;
    const data = await this.commentService.create(promptId, dto, userId);
    return { data };
  }

  @Get('prompts/:id/comments')
  async list(
    @Param('id') promptId: string,
    @Request() req: ReqWithRequesterOpt,
    @Query() pagingDTO: PagingDTO,
    @Query('parentId') parentId: string | undefined,
  ) {
    const requester = req.user;
    const userId = requester ? requester.sub : null;
    const commentCondDTO = {
      promptId,
      parentId: parentId === 'null' ? null : parentId,
    };
    const result = await this.commentService.findAll(
      userId,
      pagingDTO,
      commentCondDTO,
    );
    return result;
  }

  @Patch('comments/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Request() req: ReqWithRequester,
    @Body() dto: CommentUpdateDTO,
  ) {
    const { sub: userId } = req.user;
    await this.commentService.update(id, dto, userId);
    return { data: true };
  }

  @Delete('comments/:id')
  @UseGuards(JwtAuthGuard)
  async deleteComment(
    @Param('id') id: string,
    @Request() req: ReqWithRequester,
  ) {
    const { sub: userId } = req.user;
    await this.commentService.remove(id, userId);
    return { data: true };
  }
}
