import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/processors/database/prisma.module';
import { StarService } from './star.service';
import { StarController } from './star.controller';
import { StarRepository } from './star.repository';
import { PromptModule } from '../prompt/prompt.module';

@Module({
  imports: [PrismaModule, PromptModule],
  controllers: [StarController],
  providers: [StarService, StarRepository],
})
export class StarModule {}
