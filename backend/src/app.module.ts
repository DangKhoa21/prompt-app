import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './processors/database/prisma.module';
import { ChatModule } from './modules/chat/chat.module';
import { PromptModule } from './modules/prompt/prompt.module';

@Module({
  imports: [UserModule, PrismaModule, ChatModule, PromptModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
