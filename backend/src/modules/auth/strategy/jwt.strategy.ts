import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Requester, TokenPayload, config } from 'src/shared';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.token.auth.jwtSecret,
    });
  }

  async validate(payload: TokenPayload): Promise<Requester> {
    return this.authService.validateToken(payload); // will assign to user param in handlerRequest in JwtGuard
  }
}
