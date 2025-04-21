import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  UseGuards,
  Patch,
  Request,
  Post,
  UseInterceptors,
  UploadedFile,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserUpdateDTO } from './model';
import { JwtAuthGuard } from 'src/common/guard';
import { ErrInvalidRequest, ReqWithRequester } from 'src/shared';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from '../upload/upload.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly uploadService: UploadService,
  ) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async profile(@Request() req: ReqWithRequester) {
    const { sub: id } = req.user;
    const data = await this.userService.findById(id);
    return { data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.userService.findById(id);
    return { data };
  }

  @Post(':id/avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @Request() req: ReqWithRequester,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 512 * 1024 }), // 512kB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    const { sub: userId } = req.user;
    if (id !== userId) {
      throw ErrInvalidRequest.withMessage(
        'You can only upload your own avatar',
      );
    }
    const uploadedUrl = await this.uploadService.uploadAvatar(file, userId);
    await this.userService.update(id, { avatarUrl: uploadedUrl }, userId);
    return { data: uploadedUrl };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Request() req: ReqWithRequester,
    @Param('id') id: string,
    @Body() dto: UserUpdateDTO,
  ) {
    const { sub: userId } = req.user;
    await this.userService.update(id, dto, userId);
    return { data: true };
  }

  @Delete(':id/avatar')
  @UseGuards(JwtAuthGuard)
  async deleteAvatar(
    @Request() req: ReqWithRequester,
    @Param('id') id: string,
    @Body('previousUrl') previousUrl: string,
  ) {
    const { sub: userId } = req.user;
    if (id !== userId) {
      throw ErrInvalidRequest.withMessage(
        'You can only delete your own avatar',
      );
    }
    await this.uploadService.deleteAvatar(previousUrl);
    await this.userService.update(id, { avatarUrl: '' }, userId);
    return { data: true };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Request() req: ReqWithRequester, @Param('id') id: string) {
    const { sub: userId } = req.user;
    await this.userService.remove(id, userId);
    return { data: true };
  }
}
