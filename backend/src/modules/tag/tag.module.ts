import { forwardRef, Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { TagRepository } from './tag.repository';
import { PrismaModule } from 'src/processors/database/prisma.module';
import { PromptModule } from '../prompt/prompt.module';

@Module({
  imports: [PrismaModule, forwardRef(() => PromptModule)],
  controllers: [TagController],
  providers: [TagService, TagRepository],
  exports: [TagService],
})
export class TagModule {}
