import { ConfigType } from "@/features/template";
import {
  PromptConfig,
  TemplateConfig,
  TemplateConfigInfo,
} from "@/services/prompt/interface";

export type ConfigMapping = {
  label: string;
  type: string;
  value: string;
};

type Serializing = {
  promptId: string;
};

type SerializingResult = Serializing & {
  // Legacy: single result support
  configs?: ConfigMapping[];
  exampleResult?: string;

  // New: Multiple results support
  exampleResults?: {
    exampleResult: string;
    configs: ConfigMapping[];
  }[];
};

export type ExampleResultOutput = {
  promptId: string;
  exampleResult: string;
  selectedValues: Record<string, string>;
  textareaValues: Record<string, string>;
  arrayValues: Record<string, { id: string; values: string[] }[]>;
};

export function serializeOptionConfigData({
  promptId,
  configs,
  selectedValues,
  textareaValues,
  arrayValues,
}: {
  promptId: string;
  configs: PromptConfig[];
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

  configs.forEach((config) => {
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
  configs,
  exampleResult,
  selectedValues,
  textareaValues,
  arrayValues,
}: {
  promptId: string;
  configs: TemplateConfig[];
  exampleResult: string;
  selectedValues: Record<string, string>;
  textareaValues: Record<string, string>;
  arrayValues: Record<string, { id: string; values: string[] }[]>;
}) {
  const serialized: SerializingResult = {
    promptId,
    exampleResult,
    configs: [],
  };

  configs.forEach((config) => {
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
    }

    serialized.configs!.push({
      label: key,
      type: config.type,
      value,
    });
  });

  return {
    jsonstring: JSON.stringify(serialized),
    configs: serialized.configs,
  };
}

export function serializeMultipleResultsConfigData({
  promptId,
  results,
}: {
  promptId: string;
  results: {
    exampleResult: string;
    configs: ConfigMapping[];
  }[];
}) {
  const serialized: SerializingResult = {
    promptId,
    exampleResults: results,
  };

  return JSON.stringify(serialized);
}

function convertToExampleOutput(
  promptId: string,
  exampleResult: string,
  configs: ConfigMapping[],
  selectedValues?: Record<string, string>,
  textareaValues?: Record<string, string>,
  arrayValues?: Record<string, { id: string; values: string[] }[]>,
): ExampleResultOutput {
  const newSelected: Record<string, string> = selectedValues ?? {};
  const newTextarea: Record<string, string> = textareaValues ?? {};
  const newArray: Record<string, { id: string; values: string[] }[]> =
    arrayValues ?? {};

  // fallback: try parse values from configs (legacy)
  if (!selectedValues || !textareaValues || !arrayValues) {
    configs.forEach((config) => {
      const { label, type, value } = config;
      if (type === ConfigType.DROPDOWN || type === ConfigType.COMBOBOX) {
        newSelected[label] = value;
      } else if (type === ConfigType.TEXTAREA) {
        newTextarea[label] = value;
      } else if (type === ConfigType.ARRAY) {
        try {
          newArray[label] = JSON.parse(value);
        } catch {
          console.error("Invalid array param:", value);
        }
      }
    });
  }

  return {
    promptId,
    exampleResult,
    selectedValues: newSelected,
    textareaValues: newTextarea,
    arrayValues: newArray,
  };
}

export function deserializeResultConfigData(
  jsonString: string,
): ExampleResultOutput[] {
  const parsed: SerializingResult = JSON.parse(jsonString);

  // Legacy support: only one example result
  if (parsed.exampleResult) {
    const singleOutput = convertToExampleOutput(
      parsed.promptId,
      parsed.exampleResult,
      parsed.configs!,
    );
    return [singleOutput];
  }

  // New: multiple example results
  if (parsed.exampleResults) {
    return parsed.exampleResults.map((result) =>
      convertToExampleOutput(
        parsed.promptId,
        result.exampleResult,
        result.configs,
      ),
    );
  }

  return []; // fallback
}

// For template description and required only
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
