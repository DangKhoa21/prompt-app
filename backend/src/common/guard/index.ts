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
      if (info?.message === 'jwt expired') {
        throw ErrTokenInvalid.withLog('Token parse failed').withMessage(
          'Token expired. Please login again.',
        );
      }
      throw ErrTokenInvalid.withLog('Token parse failed').withLog(
        info?.message,
      );
    }
    return user; // will assign to req.user
  }
}

@Injectable()
export class JwtAuthGuardOptional extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      if (info?.message === 'jwt expired') {
        throw ErrTokenInvalid.withLog('Token parse failed').withMessage(
          'Token expired. Please login again.',
        );
      } else if (
        info?.message === 'jwt malformed' ||
        info?.message === 'No auth token'
      ) {
        return null; // if request sent with "Authorization: Bearer" aka sent without login
      }
      throw ErrTokenInvalid.withLog('Token parse failed').withLog(
        info?.message,
      );
    }
    return user; // will assign to req.user
  }
}
