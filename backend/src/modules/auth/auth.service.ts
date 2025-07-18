import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ResendService } from 'nestjs-resend';
import {
  AppError,
  config,
  ErrNotFound,
  ErrTokenInvalid,
  getResetPasswordTemplate,
  Requester,
  TokenPayload,
} from 'src/shared';
import {
  ChangePasswordDTO,
  changePasswordDTOSchema,
  ErrFailedToSendEmail,
  ErrInvalidEmailAndPassword,
  ErrWrongOldPassword,
  ForgotPasswordDTO,
  forgotPasswordDTOSchema,
  GooglePayload,
  ResetPasswordDTO,
  resetPasswordDTOSchema,
  UserLoginDTO,
  userLoginDTOSchema,
  UserRegisterDTO,
} from './model';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly resendService: ResendService, // no need a seperate mail module for now since the scope is small
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

  async changePassword(userId: string, dto: ChangePasswordDTO): Promise<void> {
    const user = await this.userService.findByIdWithPassword(userId);
    if (!user) {
      throw AppError.from(ErrNotFound, 404); // already checked by guard
    }

    const { oldPassword, newPassword } = changePasswordDTOSchema.parse(dto);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw AppError.from(ErrWrongOldPassword, 400);
    }

    await this.userService.updatePassword(userId, newPassword);
  }

  async forgotPassword(dto: ForgotPasswordDTO): Promise<void> {
    const { email } = forgotPasswordDTOSchema.parse(dto);

    const user = await this.userService.findByCond({ email });
    if (!user) {
      throw AppError.from(ErrNotFound, 404).withLog('Email not found');
    }

    // maybe some cache mechanisms here to prevent spamming

    const payload: TokenPayload = {
      sub: user.id,
      username: user.username,
    };

    const resetToken = this.jwtService.sign(payload, {
      secret: config.token.resetPassword.jwtSecret,
      expiresIn: config.token.resetPassword.expiresIn, // e.g., '5m'
    });

    const resetLink = `${config.frontend.webUrl}/reset-password?token=${resetToken}`;

    const result = await this.resendService.send({
      from: `${config.mailService.senderName} <noreply@${config.mailService.domain}>`,
      to: email,
      subject: 'Reset Your Password',
      html: getResetPasswordTemplate(user.username, resetLink),
    });

    if (result.error) {
      throw AppError.from(ErrFailedToSendEmail, 500).withLog(
        result.error.message,
      );
    }
  }

  async resetPassword(dto: ResetPasswordDTO): Promise<void> {
    const { token, newPassword } = resetPasswordDTOSchema.parse(dto);

    let payload: TokenPayload | null = null;
    try {
      payload = this.jwtService.verify<TokenPayload>(token, {
        secret: config.token.resetPassword.jwtSecret,
      });
    } catch (err) {
      if (err instanceof Error && err.name === 'TokenExpiredError') {
        throw AppError.from(ErrTokenInvalid, 400)
          .withLog('Token parse failed')
          .withMessage('Token expired. Please try again');
      }

      throw AppError.from(ErrTokenInvalid, 400)
        .withLog('Token parse failed')
        .withLog(err.message);
    }

    if (!payload) throw AppError.from(ErrTokenInvalid, 400);

    await this.userService.updatePassword(payload.sub, newPassword);
  }
}
