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
import { PromptPinModule } from './modules/prompt-pin/prompt-pin.module';
import { UploadModule } from './modules/upload/upload.module';
import { OptionModule } from './modules/option/option.module';
import { CommentModule } from './modules/comment/comment.module';

@Module({
  imports: [
    StarModule,
    UserModule,
    PrismaModule,
    ChatModule,
    PromptModule,
    AuthModule,
    TagModule,
    PromptPinModule,
    UploadModule,
    OptionModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
