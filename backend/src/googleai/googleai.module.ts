import { Module } from '@nestjs/common';
import { GoogleaiController } from './googleai.controller';
import { GoogleaiService } from './googleai.service';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [GoogleaiController],
  providers: [
    GoogleaiService,
    {
      provide: GoogleGenerativeAI,
      useFactory: (configService: ConfigService) =>
        new GoogleGenerativeAI(
          configService.getOrThrow('GOOGLE_GENERATIVE_AI_API_KEY'),
        ),
    },
  ],
})
export class GoogleaiModule {}
