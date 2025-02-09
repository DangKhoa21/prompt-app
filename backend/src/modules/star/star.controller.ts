import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { StarService } from './star.service';
import { JwtAuthGuard } from 'src/common/guard';
import { ReqWithRequester } from 'src/shared';

@Controller()
export class StarController {
  constructor(private readonly starService: StarService) {}

  @Post('prompts/:id/star')
  @UseGuards(JwtAuthGuard)
  async star(@Request() req: ReqWithRequester, @Param('id') promptId: string) {
    const { sub: userId } = req.user;
    await this.starService.star(promptId, userId);
    return { data: true };
  }

  @Delete('prompts/:id/unstar')
  @UseGuards(JwtAuthGuard)
  async unstar(
    @Request() req: ReqWithRequester,
    @Param('id') promptId: string,
  ) {
    const { sub: userId } = req.user;
    await this.starService.unstar(promptId, userId);
    return { data: true };
  }

  @Get('users/starred-prompts')
  @UseGuards(JwtAuthGuard)
  async getStarredPrompts(@Request() req: ReqWithRequester) {
    const { sub: userId } = req.user;
    const data = await this.starService.getStarredPrompts(userId);
    return { data };
  }
}
