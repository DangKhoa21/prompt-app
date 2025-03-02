import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './processors/database/prisma.module';
import { ChatModule } from './modules/chat/chat.module';
import { PromptModule } from './modules/prompt/prompt.module';
import { AuthModule } from './modules/auth/auth.module';
import { StarModule } from './modules/star/star.module';
import { TagModule } from './modules/tag/tag.module';

@Module({
  imports: [
    StarModule,
    UserModule,
    PrismaModule,
    ChatModule,
    PromptModule,
    AuthModule,
    TagModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
