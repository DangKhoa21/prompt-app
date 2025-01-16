import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ErrTokenInvalid } from 'src/shared';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw ErrTokenInvalid.withLog('Token parse failed').withLog(
        info?.message,
      );
    }
    return user; // will assign to req.user
  }
}
