import { ConfigType } from "@/features/template";
import {
  PromptWithConfigs,
  TemplateConfigInfo,
  TemplateWithConfigs,
} from "@/services/prompt/interface";

type ConfigMapping = {
  label: string;
  type: string;
  value: string;
};

type Serializing = {
  promptId: string;
};

type SerializingResult = Serializing & {
  configs?: ConfigMapping[];
  exampleResult?: string;
  exampleResults?: {
    exampleResult: string;
    configs: ConfigMapping[];
  }[];
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
  const serialized: Serializing & {
    configs: ConfigMapping[];
  } = {
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

export function serializeMultipleResultsConfigData({
  promptId,
  data,
  results,
}: {
  promptId: string;
  data: TemplateWithConfigs;
  results: {
    exampleResult: string;
    selectedValues: Record<string, string>;
    textareaValues: Record<string, string>;
    arrayValues: Record<string, { id: string; values: string[] }[]>;
  }[];
}) {
  const serialized: SerializingResult = {
    promptId,
    exampleResults: results,
  };

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
        if (Array.isArray(parsedArray)) {
          newArray[label] = parsedArray;
        }
      } catch (e) {
        console.log(e);
        console.error("Invalid array param:", value);
      }
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

export function stringifyInfo(infoObj: TemplateConfigInfo): string {
  return JSON.stringify(infoObj);
}

export function parseInfo(info?: string): TemplateConfigInfo {
  try {
    if (!info) return { description: "", isRequired: true };
    const parsed = JSON.parse(info);
    return {
      description: parsed.description || "",
      isRequired: parsed.isRequired !== false, // default to true
    };
  } catch (err) {
    console.log(err);
    // Fallback for legacy plain description string
    return {
      description: info || "",
      isRequired: true,
    };
  }
}
