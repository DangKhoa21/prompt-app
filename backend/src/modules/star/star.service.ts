import { Injectable } from '@nestjs/common';
import { StarRepository } from './star.repository';
import { PromptService } from '../prompt/prompt.service';
import { ErrAlreadyStarred, ErrNotStarred, Star } from './model';
import { AppError } from 'src/shared';

@Injectable()
export class StarService {
  constructor(
    private readonly starRepo: StarRepository,
    private readonly promptService: PromptService,
  ) {}

  async star(promptId: string, userId: string): Promise<void> {
    await this.promptService.findOne(promptId); // check if prompt exists

    const star = await this.starRepo.findOne(userId, promptId);
    if (star) {
      throw AppError.from(ErrAlreadyStarred, 400);
    }

    const newStar: Star = {
      promptId,
      userId,
    };

    await this.starRepo.insert(newStar);
  }

  async unstar(promptId: string, userId: string): Promise<void> {
    const star = await this.starRepo.findOne(userId, promptId);
    if (!star) {
      throw AppError.from(ErrNotStarred, 400);
    }

    await this.starRepo.delete(star);
  }

  async getStarredPrompts(userId: string) {
    const starsByUserId = await this.starRepo.findStarsByUserId(userId);

    const starredPromptIds = starsByUserId.map((star) => star.promptId);

    const starredPrompts = await this.promptService.findByIds(starredPromptIds);

    return starredPrompts;
  }
}
