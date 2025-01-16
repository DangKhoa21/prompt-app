import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {
  ErrInvalidEmailAndPassword,
  UserLoginDTO,
  userLoginDTOSchema,
} from './model';
import { AppError, ErrNotFound, Requester, TokenPayload } from 'src/shared';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(dto: UserLoginDTO): Promise<string> {
    const data = userLoginDTOSchema.parse(dto);

    // 1. Find user with email from DTO
    const user = await this.userService.findByCond({ email: data.email });
    if (!user) {
      throw AppError.from(ErrInvalidEmailAndPassword, 400).withLog(
        'Email not found',
      );
    }

    // 2. Check password
    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw AppError.from(ErrInvalidEmailAndPassword, 400).withLog(
        'Password is incorrect',
      );
    }

    // 3. Return token
    // TODO: attach roles field in payload
    const payload: TokenPayload = { sub: user.id, username: user.username };

    return this.jwtService.sign(payload);
  }

  async validateToken(payload: TokenPayload): Promise<Requester> {
    // 1. Check if user exist
    const user = await this.userService.findById(payload.sub);
    if (!user) {
      throw AppError.from(ErrNotFound, 400);
    }

    // 2. Return requester info
    const requesterInfo: Requester = {
      sub: user.id,
      username: user.username,
    };
    return requesterInfo;
  }
}
