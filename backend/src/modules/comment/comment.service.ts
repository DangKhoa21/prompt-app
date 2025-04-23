import { Injectable } from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import {
  Comment,
  CommentCard,
  CommentCondDTO,
  commentCondDTOSchema,
  CommentCreateDTO,
  commentCreateDTOSchema,
  CommentUpdateDTO,
  ErrCommentNotFound,
  ErrInvalidParentId,
} from './model';
import { PromptService } from '../prompt/prompt.service';
import { AppError, Paginated, PagingDTO, pagingDTOSchema } from 'src/shared';
import { v7 } from 'uuid';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepo: CommentRepository,
    private readonly promptService: PromptService,
  ) {}

  async create(
    promptId: string,
    dto: CommentCreateDTO,
    creatorId: string,
  ): Promise<string> {
    const data = commentCreateDTOSchema.parse(dto);

    // check if prompt exists
    await this.promptService.findOne(promptId);

    if (data.parentId) {
      const parentComment = await this.commentRepo.findById(data.parentId);
      if (!parentComment) throw AppError.from(ErrInvalidParentId, 400);
      // cannot reply to a replied comment
      if (parentComment.parentId) throw AppError.from(ErrInvalidParentId, 400);
    }

    const newId = v7();

    const newComment: Comment = {
      id: newId,
      creatorId,
      promptId,
      parentId: data.parentId,
      content: data.content,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.commentRepo.insert(newComment);

    return newId;
  }

  async update(
    id: string,
    dto: CommentUpdateDTO,
    creatorId: string,
  ): Promise<void> {
    const existedComment = await this.commentRepo.findById(id);
    if (!existedComment || existedComment.creatorId !== creatorId) {
      throw AppError.from(ErrCommentNotFound, 404);
    }

    const updateDTO: CommentUpdateDTO = {
      content: dto.content,
    };

    await this.commentRepo.update(id, updateDTO);
  }

  async remove(id: string, creatorId: string): Promise<void> {
    const existedComment = await this.commentRepo.findById(id);
    if (!existedComment || existedComment.creatorId !== creatorId) {
      throw AppError.from(ErrCommentNotFound, 404);
    }

    await this.commentRepo.delete(id);
  }

  async findAll(
    userId: string | null,
    pagingDTO: PagingDTO,
    commentCondDTO: CommentCondDTO,
  ): Promise<Paginated<CommentCard>> {
    const paging = pagingDTOSchema.parse(pagingDTO);
    const dto = commentCondDTOSchema.parse(commentCondDTO);
    const result = await this.commentRepo.list(paging, dto);
    return result;
  }
}
