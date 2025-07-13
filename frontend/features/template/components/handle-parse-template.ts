import { ConfigType } from "@/features/template/types/config-type";
import { generateUUID } from "@/lib/utils";
import {
  ConfigValue,
  TemplateConfig,
  TemplateWithConfigs,
} from "@/services/prompt/interface";

export const handleParseTemplate = (
  template: TemplateWithConfigs,
  setTemplate: (newTemplate: TemplateWithConfigs) => void,
) => {
  const promptTemplate = template.stringTemplate;
  const matches = Array.from(
    new Set(
      promptTemplate.match(/\{\{([^}]+)\}/g)?.map((m) => m.slice(2, -1)) || [],
    ),
  );

  const createConfig = (
    id: string,
    label: string,
    type: ConfigType,
    values: ConfigValue[],
  ): TemplateConfig => ({
    id,
    label,
    type,
    promptId: template.id,
    values,
  });

  const result =
    matches.length !== 0
      ? matches.map((name) => {
          const res = template.configs.find((c) => c.label === name);
          return (
            res ??
            createConfig(
              generateUUID().toString(),
              name,
              ConfigType.TEXTAREA,
              [],
            )
          );
        })
      : [];

  const newTemplate = {
    ...template,
    configs: result,
  };

  setTemplate(newTemplate);
};
