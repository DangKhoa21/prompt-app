import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'src/processors/database/prisma.module';
import { PromptModule } from '../prompt/prompt.module';
import { PromptPinService } from './prompt-pin.service';
import { PromptPinController } from './prompt-pin.controller';
import { PromptPinRepository } from './prompt-pin.repository';

@Module({
  imports: [PrismaModule, forwardRef(() => PromptModule)],
  controllers: [PromptPinController],
  providers: [PromptPinService, PromptPinRepository],
  exports: [PromptPinService],
})
export class PromptPinModule {}
