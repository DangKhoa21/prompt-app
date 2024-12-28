import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
// import { GoogleaiModule } from './googleai/googleai.module';
import { ConfigModule } from '@nestjs/config';
import { GeminiModule } from './gemini/gemini.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    GeminiModule,
    ChatModule,
    // GoogleaiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
