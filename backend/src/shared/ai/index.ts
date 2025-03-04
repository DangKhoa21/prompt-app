import { google } from '@ai-sdk/google';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { wrapLanguageModel } from 'ai';

import { customMiddleware } from './custom-middleware';

const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });

export const customModel = (apiIdentifier: string) => {
  if (apiIdentifier.includes('deepseek')) {
    return wrapLanguageModel({
      model: openrouter(apiIdentifier),
      middleware: customMiddleware,
    });
  }

  return wrapLanguageModel({
    model: google(apiIdentifier),
    middleware: customMiddleware,
  });
};

export * from './models';
export * from './prompts';
export * from './utils';
