import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ResendModule } from 'nestjs-resend';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategy/jwt.strategy';
import { GoogleStrategy } from './strategy/google.strategy';
import { UserModule } from '../user/user.module';
import { config } from 'src/shared';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: config.token.auth.jwtSecret,
      signOptions: {
        expiresIn: config.token.auth.expiresIn, // e.g., '1h'
      },
    }),
    ResendModule.forRoot({
      apiKey: config.mailService.resend.apiKey,
    }),
  ],
  providers: [AuthService, JwtStrategy, GoogleStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
