import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDTO, UserRegisterDTO } from './model';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
