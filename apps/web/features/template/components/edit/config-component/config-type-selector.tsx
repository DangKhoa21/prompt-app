import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { useTemplate } from "@/context/template-context";
import { ConfigType } from "@/features/template";

interface ConfigTypeSelectorProps {
  id: string;
  type: ConfigType;
}

export function ConfigTypeSelector({ id, type }: ConfigTypeSelectorProps) {
  const { template, setTemplate } = useTemplate();

  const handleSelectChange = (configId: string, type: ConfigType) => {
    const newTemplate = {
      ...template,
      configs: template.configs.map((config) =>
        config.id === configId
          ? {
              ...config,
              type: ConfigType[type.toUpperCase() as keyof typeof ConfigType],
            }
          : config,
      ),
    };

    setTemplate(newTemplate);
  };

  return (
    <>
      <Select
        onValueChange={(value) => {
          const handledValue =
            ConfigType[value.toUpperCase() as keyof typeof ConfigType];
          handleSelectChange(id, handledValue);
        }}
      >
        <SelectTrigger id={type.toString()} className="max-w-36">
          <SelectValue
            placeholder={`${type[0].toUpperCase()}${type.slice(1)}`}
          />
        </SelectTrigger>
        <SelectContent>
          {Object.values(ConfigType)
            .filter((value) => isNaN(Number(value)))
            .map((config) => (
              <SelectItem key={config} value={config.toString()}>
                {config[0].toUpperCase()}
                {config.slice(1)}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </>
  );
}
