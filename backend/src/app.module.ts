import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './processors/database/prisma.module';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [UserModule, PrismaModule, ChatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
