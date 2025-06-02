import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { AuthService } from '../auth.service';
import { config } from 'src/shared';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: config.google.clientId,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.redirectUri,
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  async validate(
    req,
    accessToken: string,
    refreshToken: string,
    profile,
    done: VerifyCallback,
  ): Promise<any> {
    const client = req.query.client;
    const { email, displayName, picture } = profile;

    const user = {
      email,
      username: displayName,
      picture,
    };

    const validatedUser = await this.authService.validateGoogleUser(user);

    done(null, {
      ...validatedUser,
      client,
    });
  }
}
