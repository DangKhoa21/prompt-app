import { PromptConfig, TemplateConfig } from "@/services/prompt/interface";

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
  let prompt = template;
  const FALLBACK_CONFIG = "NOT_FILLED";

  configs.forEach((config) => {
    const placeholder = `\${${config.label}}`;

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
