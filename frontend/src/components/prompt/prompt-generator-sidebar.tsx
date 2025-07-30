"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { SidebarContent } from "@/components/ui/sidebar";

import { GeneratorMode } from "./enum-generator-mode";
import { usePromptConfigState } from "./hooks/usePromptConfigState";
import { usePromptConfigsData } from "../../hooks/use-prompt-configs-data";
import PromptTabFooter from "./prompt-tab-footer";
import PromptTabHeader from "./prompt-tab-header";
import {
  MarketplaceTabContent,
  NewTabContent,
  TechniqueTabContent,
} from "./tabs";

export function PromptGeneratorSidebar() {
  const searchParams = useSearchParams();

  const promptId = searchParams.get("promptId") ?? "";
  const optionId = searchParams.get("optionId") ?? "";
  const defaultMode =
    promptId || optionId ? GeneratorMode.MARKETPLACE : GeneratorMode.NEW_AI;

  const [mode, setMode] = useState<GeneratorMode>(defaultMode);

  useEffect(() => {
    if (promptId || optionId) {
      setMode(GeneratorMode.MARKETPLACE);
    }
  }, [optionId, promptId]);

  const { data, isLoading, isError, error, refetch } =
    usePromptConfigsData(promptId);
  const {
    selectedValues,
    setSelectedValues,
    textareaValues,
    setTextareaValues,
    arrayValues,
    setArrayValues,
    isFilled,
  } = usePromptConfigState(data?.configs ?? []);

  const [idea, setIdea] = useState<string>("");

  // -- Render --
  return (
    <>
      <PromptTabHeader mode={mode} onChangeMode={setMode} />

      <SidebarContent className="prompt-generator">
        {mode === "new-ai" && <NewTabContent idea={idea} setIdea={setIdea} />}
        {mode === "marketplace" && (
          <MarketplaceTabContent
            promptId={promptId}
            optionId={optionId}
            data={data}
            isLoading={isLoading}
            isError={isError}
            error={error}
            refetch={refetch}
            selectedValues={selectedValues}
            setSelectedValues={setSelectedValues}
            textareaValues={textareaValues}
            setTextareaValues={setTextareaValues}
            arrayValues={arrayValues}
            setArrayValues={setArrayValues}
            isFilled={isFilled}
          />
        )}
        {mode === "technique" && <TechniqueTabContent />}
      </SidebarContent>

      <PromptTabFooter
        mode={mode}
        promptId={promptId}
        idea={idea}
        data={data}
        selectedValues={selectedValues}
        textareaValues={textareaValues}
        arrayValues={arrayValues}
        isFilled={isFilled}
      />
    </>
  );
}
