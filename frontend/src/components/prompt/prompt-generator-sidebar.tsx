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
  TechWithLink,
} from "./tabs";
import {
  dehydrate,
  HydrationBoundary,
  useQueryClient,
} from "@tanstack/react-query";
import { getPrompts } from "@/services/prompt";

export function PromptGeneratorSidebar() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const filter = { tagId: "01973620-6293-7113-a594-c32275e3b100" };
  queryClient.prefetchQuery({
    queryKey: ["prompts", filter],
    queryFn: () => getPrompts({ pageParam: "", filter }),
  });

  const promptId = searchParams.get("promptId") ?? "";
  const optionId = searchParams.get("optionId") ?? "";

  const [selectedTechnique, setSelectedTechnique] =
    useState<TechWithLink | null>(null);
  const [mode, setMode] = useState<GeneratorMode>(GeneratorMode.MARKETPLACE);

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
        {mode === "marketplace" ? (
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
        ) : mode === "new-ai" ? (
          <NewTabContent idea={idea} setIdea={setIdea} />
        ) : mode === "technique" ? (
          <HydrationBoundary state={dehydrate(queryClient)}>
            <TechniqueTabContent
              selectedTechnique={selectedTechnique}
              setSelectedTechnique={setSelectedTechnique}
            />
          </HydrationBoundary>
        ) : null}
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
        selectedTechnique={selectedTechnique}
      />
    </>
  );
}
