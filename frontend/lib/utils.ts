import type {
  CoreAssistantMessage,
  CoreMessage,
  CoreToolMessage,
  Message,
  ToolInvocation,
} from "ai";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type { Message as DBMessage } from "@/services/chat/interface";
import { v7 } from "uuid";
import {
  PromptWithConfigs,
  TemplateWithConfigs,
} from "@/services/prompt/interface";
import { ConfigType } from "@/features/template";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateUUID(): string {
  return v7();
}

export const formatRating = (num: number): string => {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return num.toString();
};

export function createPromptDetailURL(id: string, title: string): string {
  const formattedTitle = title.toLowerCase().replace(/\s+/g, "-");
  const detailUrl = `/prompts/${formattedTitle}-pid${id}`;
  return detailUrl;
}

export function getIdFromDetailURL(url: string): string {
  const match = url.split("-pid");
  const promptId = match[1];
  return promptId;
}

export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function sanitizeResponseMessages(
  messages: Array<CoreToolMessage | CoreAssistantMessage>,
): Array<CoreToolMessage | CoreAssistantMessage> {
  const toolResultIds: Array<string> = [];

  for (const message of messages) {
    if (message.role === "tool") {
      for (const content of message.content) {
        if (content.type === "tool-result") {
          toolResultIds.push(content.toolCallId);
        }
      }
    }
  }

  const messagesBySanitizedContent = messages.map((message) => {
    if (message.role !== "assistant") return message;

    if (typeof message.content === "string") return message;

    const sanitizedContent = message.content.filter((content) =>
      content.type === "tool-call"
        ? toolResultIds.includes(content.toolCallId)
        : content.type === "text"
          ? content.text.length > 0
          : true,
    );

    return {
      ...message,
      content: sanitizedContent,
    };
  });

  return messagesBySanitizedContent.filter(
    (message) => message.content.length > 0,
  );
}

export function getMostRecentUserMessage(messages: Array<CoreMessage>) {
  const userMessages = messages.filter((message) => message.role === "user");
  return userMessages.at(-1);
}

function addToolMessageToChat({
  toolMessage,
  messages,
}: {
  toolMessage: CoreToolMessage;
  messages: Array<Message>;
}): Array<Message> {
  return messages.map((message) => {
    if (message.toolInvocations) {
      return {
        ...message,
        toolInvocations: message.toolInvocations.map((toolInvocation) => {
          const toolResult = toolMessage.content.find(
            (tool) => tool.toolCallId === toolInvocation.toolCallId,
          );

          if (toolResult) {
            return {
              ...toolInvocation,
              state: "result",
              result: toolResult.result,
            };
          }

          return toolInvocation;
        }),
      };
    }

    return message;
  });
}

export function convertToUIMessages(
  messages: Array<DBMessage>,
): Array<Message> {
  return messages.reduce((chatMessages: Array<Message>, message) => {
    if (message.role === "tool") {
      return addToolMessageToChat({
        toolMessage: message as CoreToolMessage,
        messages: chatMessages,
      });
    }

    let textContent = "";
    const toolInvocations: Array<ToolInvocation> = [];

    if (typeof message.content === "string") {
      textContent = message.content;
    } else if (Array.isArray(message.content)) {
      for (const content of message.content) {
        if (content.type === "text") {
          textContent += content.text;
        } else if (content.type === "tool-call") {
          toolInvocations.push({
            state: "call",
            toolCallId: content.toolCallId,
            toolName: content.toolName,
            args: content.args,
          });
        }
      }
    }

    chatMessages.push({
      id: message.id,
      role: message.role as Message["role"],
      content: textContent,
      toolInvocations,
    });

    return chatMessages;
  }, []);
}

export function sanitizeUIMessages(messages: Array<Message>): Array<Message> {
  const messagesBySanitizedToolInvocations = messages.map((message) => {
    if (message.role !== "assistant") return message;

    if (!message.toolInvocations) return message;

    const toolResultIds: Array<string> = [];

    for (const toolInvocation of message.toolInvocations) {
      if (toolInvocation.state === "result") {
        toolResultIds.push(toolInvocation.toolCallId);
      }
    }

    const sanitizedToolInvocations = message.toolInvocations.filter(
      (toolInvocation) =>
        toolInvocation.state === "result" ||
        toolResultIds.includes(toolInvocation.toolCallId),
    );

    return {
      ...message,
      toolInvocations: sanitizedToolInvocations,
    };
  });

  return messagesBySanitizedToolInvocations.filter(
    (message) =>
      message.content.length > 0 ||
      (message.toolInvocations && message.toolInvocations.length > 0),
  );
}

type ConfigMapping = {
  label: string;
  type: string;
  value: string;
};

type Serializing = {
  promptId: string;
  configs: ConfigMapping[];
};

type SerializingResult = Serializing & {
  exampleResult: string;
};

export function serializeConfigData({
  promptId,
  data,
  selectedValues,
  textareaValues,
  arrayValues,
}: {
  promptId: string;
  data: PromptWithConfigs;
  selectedValues: Record<string, string>;
  textareaValues: Record<string, string>;
  arrayValues: Record<string, { id: string; values: string[] }[]>;
}) {
  const serialized: Serializing = {
    promptId,
    configs: [],
  };

  data.configs.forEach((config) => {
    const key = config.label;
    let value: string = "";

    if (
      config.type === ConfigType.DROPDOWN ||
      config.type === ConfigType.COMBOBOX
    ) {
      value = selectedValues[key];
    } else if (config.type === ConfigType.TEXTAREA) {
      value = textareaValues[key];
    } else if (config.type === ConfigType.ARRAY) {
      value = JSON.stringify(arrayValues[key]);
    } else {
      return;
    }

    serialized.configs.push({
      label: key,
      type: config.type,
      value,
    });
  });

  return JSON.stringify(serialized);
}

export function serializeResultConfigData({
  promptId,
  data,
  selectedValues,
  textareaValues,
  arrayValues,
  exampleResult,
}: {
  promptId: string;
  data: TemplateWithConfigs;
  selectedValues: Record<string, string>;
  textareaValues: Record<string, string>;
  arrayValues: Record<string, { id: string; values: string[] }[]>;
  exampleResult: string;
}) {
  const serialized: SerializingResult = {
    promptId,
    exampleResult,
    configs: [],
  };

  data.configs.forEach((config) => {
    const key = config.label;
    let value: string = "";

    if (
      config.type === ConfigType.DROPDOWN ||
      config.type === ConfigType.COMBOBOX
    ) {
      value = selectedValues[key];
    } else if (config.type === ConfigType.TEXTAREA) {
      value = textareaValues[key];
    } else if (config.type === ConfigType.ARRAY) {
      value = JSON.stringify(arrayValues[key]);
    } else {
      return;
    }

    serialized.configs.push({
      label: key,
      type: config.type,
      value,
    });
  });

  return JSON.stringify(serialized);
}

export type ExampleResultOutput = {
  promptId: string;
  exampleResult: string;
  selectedValues: Record<string, string>;
  textareaValues: Record<string, string>;
  arrayValues: Record<string, { id: string; values: string[] }[]>;
};

export function deserializeResultConfigData(
  jsonString: string,
): ExampleResultOutput {
  const parsed: SerializingResult = JSON.parse(jsonString);

  const newSelected: Record<string, string> = {};
  const newTextarea: Record<string, string> = {};
  const newArray: Record<string, { id: string; values: string[] }[]> = {};

  parsed.configs.forEach((config) => {
    const { label, type, value } = config;

    if (type === ConfigType.DROPDOWN || type === ConfigType.COMBOBOX) {
      newSelected[label] = value;
    } else if (type === ConfigType.TEXTAREA) {
      newTextarea[label] = value;
    } else if (type === ConfigType.ARRAY) {
      try {
        const parsedArray = JSON.parse(value);
        if (Array.isArray(parsed)) {
          newArray[label] = parsedArray;
        }
      } catch (e) {
        console.log(e);
      }
      console.error("Invalid array param:", value);
    }
  });

  return {
    promptId: parsed.promptId,
    exampleResult: parsed.exampleResult,
    selectedValues: newSelected,
    textareaValues: newTextarea,
    arrayValues: newArray,
  };
}
