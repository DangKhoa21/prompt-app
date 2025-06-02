import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {
  ErrInvalidEmailAndPassword,
  GooglePayload,
  UserLoginDTO,
  userLoginDTOSchema,
  UserRegisterDTO,
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

    return this.createToken(payload);
  }

  async createToken(payload: TokenPayload): Promise<string> {
    return this.jwtService.sign(payload);
  }

  async register(dto: UserRegisterDTO): Promise<string> {
    return this.userService.create(dto);
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

  async validateGoogleUser(payload: GooglePayload): Promise<Requester> {
    const user = await this.userService.findByCond({
      email: payload.email,
    });

    if (!user) {
      const newUser = {
        email: payload.email,
        username: payload.username,
        password: '',
        avatarUrl: payload.picture,
      };

      const newUserId = await this.userService.createWithGoogle(newUser);
      const { id, username } = await this.userService.findById(newUserId);

      const requesterInfo: Requester = {
        sub: id,
        username: username,
      };
      return requesterInfo;
    } else {
      const requesterInfo: Requester = {
        sub: user.id,
        username: user.username,
      };
      return requesterInfo;
    }
  }
}
