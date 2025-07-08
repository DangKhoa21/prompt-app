import { validateFilledConfigs } from "@/lib/utils/utils.generate-prompt";
import { PromptConfig } from "@/services/prompt/interface";
import { useEffect, useState } from "react";

export type ConfigInpStates = Record<string, string>;
export type ArrayConfigInStates = Record<
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
  const [selectedValues, setSelectedValues] = useState<ConfigInpStates>({});
  const [textareaValues, setTextareaValues] = useState<ConfigInpStates>({});
  const [arrayValues, setArrayValues] = useState<ArrayConfigInStates>({});
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
