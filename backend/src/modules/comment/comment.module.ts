import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CommentRepository } from './comment.repository';
import { PromptModule } from '../prompt/prompt.module';
import { PrismaModule } from 'src/processors/database/prisma.module';

@Module({
  imports: [PrismaModule, PromptModule],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository],
})
export class CommentModule {}
