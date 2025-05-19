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

  configs.forEach((config) => {
    const placeholder = `{${config.label}}`;

    switch (config.type) {
      case "dropdown":
      case "combobox":
        prompt = prompt.replace(
          placeholder,
          selectedValues[config.label] ?? "",
        );
        break;

      case "textarea":
        prompt = prompt.replace(
          placeholder,
          textareaValues[config.label] ?? "",
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
        prompt = prompt.replace(placeholder, lines);
        break;
    }
  });

  return prompt.replace(/ {2,}/g, " ").replace(/\\n/g, "\n");
}
