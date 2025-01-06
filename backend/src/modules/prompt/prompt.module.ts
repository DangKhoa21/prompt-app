import { Module } from '@nestjs/common';
import { PromptService } from './prompt.service';
import { PromptController } from './prompt.controller';
import { PromptRepository } from './prompt.repository';
import { PrismaModule } from 'src/processors/database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PromptController],
  providers: [PromptRepository, PromptService],
})
export class PromptModule {}
