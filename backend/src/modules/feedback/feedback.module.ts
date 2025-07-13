import { Module } from '@nestjs/common';
import { FeedbackController } from './feedback.controller';
import { PrismaModule } from 'src/processors/database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FeedbackController],
})
export class FeedbackModule {}
