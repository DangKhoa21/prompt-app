import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserUpdateDTO } from './model';
import { JwtAuthGuard } from 'src/common/guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.userService.findById(id);
    return { data };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() dto: UserUpdateDTO) {
    await this.userService.update(id, dto);
    return { data: true };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    await this.userService.remove(id);
    return { data: true };
  }
}
