import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'src/processors/database/prisma.module';
import { StarService } from './star.service';
import { StarController } from './star.controller';
import { StarRepository } from './star.repository';
import { PromptModule } from '../prompt/prompt.module';
import { TagModule } from '../tag/tag.module';

@Module({
  imports: [PrismaModule, forwardRef(() => PromptModule), TagModule],
  controllers: [StarController],
  providers: [StarService, StarRepository],
  exports: [StarService],
})
export class StarModule {}
