import { validateFilledConfigs } from "@/lib/utils/utils.generate-prompt";
import { PromptConfig } from "@/services/prompt/interface";
import { useEffect, useState } from "react";

export type ConfigInputState = Record<string, string>;
export type ArrayConfigInputState = Record<
  string,
  { id: string; values: string[] }[]
>;

export type PromptFillState = {
  isValid: boolean;
  unfilledConfigs: string[];
  filledCount: number;
  totalCount: number;
};

export function usePromptConfigState(configs: PromptConfig[]) {
  const [selectedValues, setSelectedValues] = useState<ConfigInputState>({});
  const [textareaValues, setTextareaValues] = useState<ConfigInputState>({});
  const [arrayValues, setArrayValues] = useState<ArrayConfigInputState>({});
  const [isFilled, setIsFilled] = useState<PromptFillState>({
    isValid: false,
    unfilledConfigs: [] as string[],
    filledCount: 0,
    totalCount: 0,
  });

  useEffect(() => {
    if (configs) {
      const result = validateFilledConfigs(
        configs,
        selectedValues,
        textareaValues,
        arrayValues,
      );
      setIsFilled(result);
    }
  }, [configs, selectedValues, textareaValues, arrayValues]);

  return {
    selectedValues,
    setSelectedValues,
    textareaValues,
    setTextareaValues,
    arrayValues,
    setArrayValues,
    isFilled,
  };
}
