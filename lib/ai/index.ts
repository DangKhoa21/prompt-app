import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { experimental_wrapLanguageModel as wrapLanguageModel } from "ai";

import { customMiddleware } from "@/lib/ai/custom-middleware";

export const customModel = (apiIdentifier: string) => {
  const modelName = apiIdentifier.split("-")[0];

  if (modelName === "gpt") {
    return wrapLanguageModel({
      model: openai(apiIdentifier),
      middleware: customMiddleware,
    });
  } else {
    return wrapLanguageModel({
      model: google(apiIdentifier),
      middleware: customMiddleware,
    });
  }
};
