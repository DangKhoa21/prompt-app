import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PromptPinService } from './prompt-pin.service';
import { JwtAuthGuard } from 'src/common/guard';
import { ReqWithRequester } from 'src/shared';

@Controller()
export class PromptPinController {
  constructor(private readonly promptPinService: PromptPinService) {}

  @Post('prompts/:id/pin')
  @UseGuards(JwtAuthGuard)
  async pin(@Request() req: ReqWithRequester, @Param('id') promptId: string) {
    const { sub: userId } = req.user;
    await this.promptPinService.pin(promptId, userId);
    return { data: true };
  }

  @Delete('prompts/:id/unpin')
  @UseGuards(JwtAuthGuard)
  async unpin(@Request() req: ReqWithRequester, @Param('id') promptId: string) {
    const { sub: userId } = req.user;
    await this.promptPinService.unpin(promptId, userId);
    return { data: true };
  }

  @Get('users/pinned-prompts')
  @UseGuards(JwtAuthGuard)
  async getPinnedPrompts(@Request() req: ReqWithRequester) {
    const { sub: userId } = req.user;
    // currently, this is a temporary approach
    const data = await this.promptPinService.getPinnedPrompts(userId);
    return { data };
  }
}
