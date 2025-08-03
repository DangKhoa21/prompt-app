import { Module } from '@nestjs/common';
import { OptionService } from './option.service';
import { OptionController } from './option.controller';
import { OptionRepository } from './option.repository';
import { PrismaModule } from 'src/processors/database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [OptionController],
  providers: [OptionService, OptionRepository],
})
export class OptionModule {}
