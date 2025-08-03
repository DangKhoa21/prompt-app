import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PromptPinRepository } from './prompt-pin.repository';
import { PromptService } from '../prompt/prompt.service';
import { ErrAlreadyPinned, ErrMaxPins, ErrNotPinned, PromptPin } from './model';
import { AppError } from 'src/shared';

@Injectable()
export class PromptPinService {
  constructor(
    private readonly promptPinRepo: PromptPinRepository,
    @Inject(forwardRef(() => PromptService))
    private readonly promptService: PromptService,
  ) {}

  async pin(promptId: string, userId: string): Promise<void> {
    await this.promptService.findOne(promptId); // check if prompt exists

    const promptPins = await this.promptPinRepo.findPromptPinsByUserId(userId);
    if (promptPins.some((promptPin) => promptPin.promptId === promptId)) {
      throw AppError.from(ErrAlreadyPinned, 400);
    }

    if (promptPins.length >= 10) {
      throw AppError.from(ErrMaxPins, 400);
    }

    const newPromptPin: PromptPin = {
      promptId,
      userId,
    };

    await this.promptPinRepo.insert(newPromptPin);
  }

  async unpin(promptId: string, userId: string): Promise<void> {
    const promptPin = await this.promptPinRepo.findOne(userId, promptId);
    if (!promptPin) {
      throw AppError.from(ErrNotPinned, 400);
    }

    await this.promptPinRepo.delete(promptPin);
  }

  async getPinnedPrompts(userId: string) {
    const promptPinsByUserId =
      await this.promptPinRepo.findPromptPinsByUserId(userId);
    const pinnedPromptIds = promptPinsByUserId.map(
      (promptPin) => promptPin.promptId,
    );

    const paging = { cursor: undefined, limit: 10 };

    const { data: promptCardsRepo } = await this.promptService.list(paging, {
      promptIds: pinnedPromptIds,
    });

    const promptPinCards = promptCardsRepo.map(({ id, title, description }) => {
      return {
        id,
        title,
        description,
      };
    });

    return promptPinCards;
  }
}
