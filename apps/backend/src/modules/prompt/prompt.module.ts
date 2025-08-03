import { forwardRef, Module } from '@nestjs/common';
import { PromptService } from './prompt.service';
import { PromptController } from './prompt.controller';
import { PromptRepository } from './prompt.repository';
import { PromptConfigRepository } from './config.repository';
import { ConfigValueRepository } from './value.repository';
import { PrismaModule } from 'src/processors/database/prisma.module';
import { RedisModule } from 'src/processors/redis/redis.module';
import { TagModule } from '../tag/tag.module';
import { StarModule } from '../star/star.module';
import { PromptPinModule } from '../prompt-pin/prompt-pin.module';
import { PromptGenService } from './prompt-gen.service';
import { config } from 'src/shared';

@Module({
  imports: [
    PrismaModule,
    RedisModule.forRoot({ redisUrl: config.redis.url }),
    forwardRef(() => TagModule),
    forwardRef(() => StarModule),
    forwardRef(() => PromptPinModule),
  ],
  controllers: [PromptController],
  providers: [
    PromptGenService,
    PromptService,
    PromptRepository,
    PromptConfigRepository,
    ConfigValueRepository,
  ],
  exports: [PromptService],
})
export class PromptModule {}
