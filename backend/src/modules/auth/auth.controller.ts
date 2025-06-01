import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDTO, UserRegisterDTO } from './model';
import { GoogleAuthGuard } from 'src/common/guard';
import { config } from 'src/shared';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleLogin() {
    // initiates the Google OAuth2 login flow
    // user will be redirected to the Google login page
    // web call: /auth/google?client=web
    // extension call: /auth/google?client=extension
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() req, @Res() res) {
    const token = await this.authService.createToken(req.user);

    if (req.query.client === 'extension') {
      res.redirect(
        `${config.frontend.extensionUrl}/auth/callback.html?token=${token}`,
      );
    } else {
      res.redirect(
        `${config.frontend.webUrl}/auth/callback.html?token=${token}`,
      );
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: UserLoginDTO) {
    const data = await this.authService.login(dto); // return JWT token
    return { data };
  }

  @Post('register')
  async create(@Body() dto: UserRegisterDTO) {
    const data = await this.authService.register(dto);
    return { data };
  }
}
