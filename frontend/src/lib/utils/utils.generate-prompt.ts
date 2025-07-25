import { ConfigType } from "@/features/template";
import { parseInfo } from "@/lib/utils/utils.details";
import { PromptConfig, TemplateConfig } from "@/services/prompt/interface";

// Replace all the old ${}
export function parseTemplateText(text: string): string {
  return text.replace(/\${(.*?)}/g, (_, key) => `{{${key.trim()}}}`);
}

export function fillPromptTemplate({
  template,
  configs,
  selectedValues,
  textareaValues,
  arrayValues,
}: {
  template: string;
  configs: PromptConfig[] | TemplateConfig[];
  selectedValues: Record<string, string>;
  textareaValues: Record<string, string>;
  arrayValues: Record<string, { id: string; values: string[] }[]>;
}) {
  let prompt = parseTemplateText(template);
  const FALLBACK_CONFIG = "N/A";

  configs.forEach((config) => {
    const placeholder = `{{${config.label}}}`;

    switch (config.type) {
      case "dropdown":
      case "combobox":
        prompt = prompt.replace(
          placeholder,
          selectedValues[config.label] ?? FALLBACK_CONFIG,
        );
        break;

      case "textarea":
        prompt = prompt.replace(
          placeholder,
          textareaValues[config.label] ?? FALLBACK_CONFIG,
        );
        break;

      case "array":
        const lines = (arrayValues[config.label] ?? [])
          .map((item, index) =>
            item.values
              .map(
                (value, i) =>
                  `\n\t${config.values[i].value} ${index + 1}: ${value}`,
              )
              .join(""),
          )
          .join("\n");
        prompt = prompt.replace(placeholder, lines ?? FALLBACK_CONFIG);
        break;
    }
  });

  return prompt.replace(/ {2,}/g, " ").replace(/\\n/g, "\n");
}

export function validateFilledConfigs(
  configs: PromptConfig[] | TemplateConfig[],
  selectedValues: Record<string, string>,
  textareaValues: Record<string, string>,
  arrayValues: Record<string, { id: string; values: string[] }[]>,
): {
  isValid: boolean;
  unfilledConfigs: string[];
  filledCount: number;
  totalCount: number;
} {
  const unfilledConfigs: string[] = [];
  let totalCount = 0;

  configs.forEach((config) => {
    const { isRequired } = parseInfo(config.info);
    if (!isRequired) return;

    totalCount += 1;

    const value =
      config.type === ConfigType.TEXTAREA
        ? textareaValues[config.label]
        : config.type === ConfigType.ARRAY
          ? arrayValues[config.label]
          : selectedValues[config.label];

    const isFilled =
      config.type === ConfigType.ARRAY
        ? Array.isArray(value) &&
          value.length > 0 &&
          value.every(
            (item) =>
              Array.isArray(item.values) &&
              item.values.length > 0 &&
              item.values.some((v) => v.trim() !== ""),
          )
        : typeof value === "string" &&
          value.trim() !== "" &&
          value.trim().toLowerCase() !== "none";

    if (!isFilled) {
      unfilledConfigs.push(config.label);
    }
  });

  const filledCount = totalCount - unfilledConfigs.length;

  return {
    isValid: unfilledConfigs.length === 0,
    unfilledConfigs,
    filledCount,
    totalCount,
  };
}
