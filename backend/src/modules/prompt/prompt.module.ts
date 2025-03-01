import { forwardRef, Module } from '@nestjs/common';
import { PromptService } from './prompt.service';
import { PromptController } from './prompt.controller';
import { PromptRepository } from './prompt.repository';
import { PromptConfigRepository } from './config.repository';
import { ConfigValueRepository } from './value.repository';
import { PrismaModule } from 'src/processors/database/prisma.module';
import { TagModule } from '../tag/tag.module';
import { StarModule } from '../star/star.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => TagModule),
    forwardRef(() => StarModule),
  ],
  controllers: [PromptController],
  providers: [
    PromptService,
    PromptRepository,
    PromptConfigRepository,
    ConfigValueRepository,
  ],
  exports: [PromptService],
})
export class PromptModule {}
