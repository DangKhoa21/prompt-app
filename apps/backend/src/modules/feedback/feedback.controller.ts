import { Controller, Post, Body } from '@nestjs/common';
import { PrismaService } from 'src/processors/database/prisma.service';
import { Feedback, FeedbackCreateDTO, feedbackCreateSchema } from './model';
import { v7 } from 'uuid';

@Controller('feedback')
export class FeedbackController {
  // we use PrismaService directly here for simplicity
  constructor(private readonly prismaService: PrismaService) {}

  @Post()
  async create(@Body() dto: FeedbackCreateDTO) {
    const data = feedbackCreateSchema.parse(dto);

    const newFeedback: Feedback = {
      id: v7(),
      message: data.message,
      email: data.email,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.prismaService.feedback.create({
      data: newFeedback,
    });

    return { data: newFeedback.id };
  }
}
