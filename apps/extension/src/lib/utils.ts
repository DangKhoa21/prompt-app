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

export function openCenteredPopup(url: string, width: number, height: number) {
  const screenLeft =
    window.screenLeft !== undefined ? window.screenLeft : window.screenX;
  const screenTop =
    window.screenTop !== undefined ? window.screenTop : window.screenY;

  const innerWidth =
    window.innerWidth || document.documentElement.clientWidth || screen.width;
  const innerHeight =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    screen.height;

  const left = Math.floor(innerWidth / 2 - width / 2 + screenLeft);
  const top = Math.floor(innerHeight / 2 - height / 2 + screenTop);

  return browser.windows.create({
    url: url,
    type: "popup",
    width: width,
    height: height,
    left: left,
    top: top,
  });
}
