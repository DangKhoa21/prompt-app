import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { v7 } from "uuid";
import { PromptWithConfigs } from "@/services/prompt/interface";
import { ConfigType } from "@/features/template";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateUUID(): string {
  return v7();
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
