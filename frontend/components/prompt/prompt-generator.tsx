"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  ExternalLinkIcon,
  Pin,
  RotateCcw,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { Technique } from "@/app/(home)/(public)/techniques/technique-type";
import { LoadingSpinner } from "@/components/icons";
import RenderConfigInput from "@/components/prompt/generator-items/generator-config-item";
import { PromptSearch } from "@/components/prompt/prompt-search";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { BetterTooltip } from "@/components/ui/tooltip";
import { techniques } from "@/constants/techniques";
import { usePrompt } from "@/context/prompt-context";
import { ConfigType, usePinPrompt } from "@/features/template";
import axios from "@/lib/axios/axiosWithAuth";
import { generateUUID } from "@/lib/utils";
import { serializeOptionConfigData } from "@/lib/utils/utils.details";
import {
  fillPromptTemplate,
  validateFilledConfigs,
} from "@/lib/utils/utils.generate-prompt";
import { getPromptWithConfigs } from "@/services/prompt";
import { createShareOption } from "@/services/share-option";

// -- Types --
enum GeneratorMode {
  NEW_AI = "new-ai",
  MARKETPLACE = "marketplace",
  TECHNIQUE = "technique",
}
type ConfigInpStates = Record<string, string>;
type ArrayConfigInStates = Record<string, { id: string; values: string[] }[]>;

export function PromptGeneratorSidebar() {
  const [mode, setMode] = useState<GeneratorMode>(GeneratorMode.NEW_AI);
  const [selectedTechnique, setSelectedTechnique] = useState<Technique | null>(
    null,
  );

  const { systemInstruction, setSystemInstruction, setPrompt } = usePrompt();
  const [selectedValues, setSelectedValues] = useState<ConfigInpStates>({});
  const [textareaValues, setTextareaValues] = useState<ConfigInpStates>({});
  const [arrayValues, setArrayValues] = useState<ArrayConfigInStates>({});
  const [isFilled, setIsFilled] = useState({
    isValid: false,
    unfilledConfigs: [""],
    filledCount: 0,
    totalCount: 0,
  });

  const searchParams = useSearchParams();
  const promptId = searchParams.get("promptId");

  const { isPending, isError, data, error, refetch } = useQuery({
    queryKey: ["prompt", promptId],
    queryFn: () => getPromptWithConfigs(promptId),
    // enabled: !!promptId,
  });

  const pinPromptMutation = usePinPrompt();
  const createShareOptionMutation = useMutation({
    mutationFn: createShareOption,
    onSuccess: () => toast.success("Create share option successfully"),
    onError: (e) =>
      toast.error(e.message || "Something went wrong, please try again!"),
  });

  const fetchOptionData = useCallback(async () => {
    const optionId = searchParams.get("optionId");
    if (!data || !optionId) return;

    setMode(GeneratorMode.MARKETPLACE);

    try {
      const { data: res } = await axios.get(`/option/${optionId}`);
      const parsed = JSON.parse(res.data.option);

      const newSelected: ConfigInpStates = {};
      const newTextarea: ConfigInpStates = {};
      const newArray: ArrayConfigInStates = {};

      parsed.configs.forEach(
        (config: { label: string; type: ConfigType; value: string }) => {
          if (config.value == null) return;

          switch (config.type) {
            case ConfigType.DROPDOWN:
            case ConfigType.COMBOBOX:
              newSelected[config.label] = config.value;
              break;
            case ConfigType.TEXTAREA:
              newTextarea[config.label] = config.value;
              break;
            case ConfigType.ARRAY:
              newArray[config.label] = JSON.parse(config.value);
              break;
          }
        },
      );

      setSelectedValues(newSelected);
      setTextareaValues(newTextarea);
      setArrayValues(newArray);
    } catch (err) {
      console.error("Failed to fetch option data:", err);
    }
  }, [data, searchParams]);

  // -- Effects --
  useEffect(() => {
    fetchOptionData();
  }, [fetchOptionData]);

  useEffect(() => {
    if (data && data.systemInstruction !== systemInstruction) {
      setSystemInstruction(data.systemInstruction ?? null);
    }
  }, [data, systemInstruction, setSystemInstruction]);

  useEffect(() => {
    if (data) {
      const result = validateFilledConfigs(
        data.configs,
        selectedValues,
        textareaValues,
        arrayValues,
      );

      setIsFilled(result);
    }
  }, [data, selectedValues, textareaValues, arrayValues]);

  // -- Handlers --
  const handlePrompt = useCallback(
    (isSending: boolean) => {
      if (!data) return;
      const prompt = fillPromptTemplate({
        template: data.stringTemplate,
        configs: data.configs,
        selectedValues,
        textareaValues,
        arrayValues,
      });

      setPrompt({ id: data.id, value: prompt, isSending });
    },
    [data, selectedValues, textareaValues, arrayValues, setPrompt],
  );

  const handleShare = useCallback(() => {
    if (!promptId || !data) return;

    const serialized: string = serializeOptionConfigData({
      promptId,
      configs: data.configs,
      selectedValues,
      textareaValues,
      arrayValues,
    });

    const optionId = generateUUID();

    const createShare = createShareOptionMutation.mutateAsync({
      optionId,
      option: serialized,
    });

    toast.promise(createShare, {
      loading: "Creating share option...",
      success: (returnedId: string) => {
        const url = new URL(window.location.href);
        url.searchParams.set("promptId", promptId);
        url.searchParams.set("optionId", returnedId);
        navigator.clipboard.writeText(url.toString());
        return "Shareable URL copied to clipboard!";
      },
      error: () => "Failed to create share option",
    });
  }, [
    promptId,
    data,
    selectedValues,
    textareaValues,
    arrayValues,
    createShareOptionMutation,
  ]);

  // -- Render --
  if (mode === "technique") return renderTechniqueMode();
  if (isPending)
    return (
      <div className="flex h-full justify-center items-center mt-4">
        <LoadingSpinner />
      </div>
    );
  if (isError) return renderError(error.message);
  return renderDefaultSidebar();

  // -- Subcomponents --
  function renderTechniqueMode() {
    return (
      <>
        <SidebarHeader className="prompt-editor pb-0">
          <div className="flex justify-between items-center p-2">
            <div className="flex items-center">
              <Button
                variant="ghost"
                className="h-8 w-8"
                onClick={() =>
                  selectedTechnique
                    ? setSelectedTechnique(null)
                    : setMode(GeneratorMode.MARKETPLACE)
                }
              >
                <ChevronLeft />
              </Button>
              <div className="text-base leading-tight ml-2">
                <span className="font-semibold">
                  {selectedTechnique ? "Back to techniques" : "Techniques"}
                </span>
              </div>
            </div>
            <Link href="/techniques" target="_blank">
              <ExternalLinkIcon className="w-5 h-5" />
            </Link>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-4 overflow-y-auto">
          {!selectedTechnique ? (
            <div>
              <h2 className="text-lg font-semibold mt-4 mb-2">
                Prompt Techniques
              </h2>
              <div className="flex flex-col gap-2">
                {techniques.map((tech) => (
                  <Button
                    key={tech.id}
                    variant="outline"
                    className="flex justify-start gap-2"
                    onClick={() => setSelectedTechnique(tech)}
                  >
                    {tech.icon}
                    <div className="text-left truncate">
                      <p className="font-semibold">{tech.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {tech.description}
                      </p>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-semibold mb-1">
                {selectedTechnique.name}
              </h2>
              <p className="text-sm text-muted-foreground mb-2">
                {selectedTechnique.description}
              </p>
              <div className="mb-3">
                <p className="font-semibold">Use Case:</p>
                <p className="text-sm mb-2">{selectedTechnique.useCase}</p>
              </div>
              <div className="mb-3">
                <p className="font-semibold">Prompt Template:</p>
                <pre className="bg-muted p-2 rounded text-sm whitespace-pre-wrap">
                  {selectedTechnique.template}
                </pre>
              </div>
              <Button
                onClick={() => {
                  setPrompt({
                    id: `technique-${selectedTechnique.id}`,
                    value: selectedTechnique.template,
                    isSending: false,
                  });
                  toast.success("Technique template inserted into prompt!");
                }}
              >
                Use This Template
              </Button>
            </div>
          )}
        </SidebarContent>
      </>
    );
  }

  function renderDefaultSidebar() {
    if (!data) return renderError("Data not found");

    return (
      <>
        <SidebarHeader className="prompt-editor pb-0">
          <div className="flex justify-between items-center p-2">
            <div className="flex items-center">
              <Button
                className="new-ai-prompt w-20"
                variant="outline"
                onClick={() => setMode(GeneratorMode.NEW_AI)}
              >
                New
              </Button>
              <Button
                className="marketplace w-32"
                variant="outline"
                onClick={() => setMode(GeneratorMode.MARKETPLACE)}
              >
                Marketplace
              </Button>
              <Button
                className="techniques-handbook w-32"
                variant="outline"
                onClick={() => setMode(GeneratorMode.TECHNIQUE)}
              >
                Techniques
              </Button>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="gap-0">
          <SidebarGroup>
            <SidebarGroupContent className="px-4">
              <div className="text-base leading-tight ml-2">
                <span className="font-semibold">{data.title}</span>
              </div>
              {data.id !== "1" && (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={handleShare}
                  >
                    {" "}
                    <Share2 className="h-4 w-4" />{" "}
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => pinPromptMutation.mutate(data.id)}
                  >
                    {" "}
                    <Pin />{" "}
                  </Button>
                </div>
              )}
            </SidebarGroupContent>

            <SidebarGroupContent className="px-4">
              <p>{data.description}</p>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>
              <Label htmlFor="prompt-search">Search for another prompt</Label>
            </SidebarGroupLabel>
            <SidebarGroupContent className="px-2">
              <PromptSearch />
            </SidebarGroupContent>
          </SidebarGroup>

          {data.configs?.map((config, i) => (
            <RenderConfigInput
              key={`config-${i}`}
              config={config}
              isFilled={isFilled}
              selectedValues={selectedValues}
              textareaValues={textareaValues}
              arrayValues={arrayValues}
              setSelectedValues={setSelectedValues}
              setTextareaValues={setTextareaValues}
              setArrayValues={setArrayValues}
            />
          ))}
        </SidebarContent>

        {data.id !== "1" && (
          <SidebarFooter>
            <BetterTooltip
              content={`Unfilled required config(s): ${isFilled.unfilledConfigs.join(
                ", ",
              )}`}
            >
              <div className="flex flex-col gap-1 px-2">
                <Progress
                  value={(isFilled.filledCount / isFilled.totalCount) * 100}
                  className="w-full h-2 mt-2 bg-muted"
                />
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  {isFilled.filledCount} / {isFilled.totalCount} fields filled
                </p>
              </div>
            </BetterTooltip>
            <div className="flex justify-around gap-4 p-2">
              <Button
                className="w-1/2"
                disabled={!isFilled.isValid}
                onClick={() => handlePrompt(false)}
              >
                Generate
              </Button>
              <Button
                className="w-1/2"
                disabled={!isFilled.isValid}
                onClick={() => handlePrompt(true)}
              >
                Send
              </Button>
            </div>
          </SidebarFooter>
        )}
      </>
    );
  }

  function renderError(message: string) {
    return (
      <div className="flex flex-col gap-2 justify-center text-center items-center mt-4">
        <p className="text-sm">Please try again! {message}</p>
        <Button variant="ghost" className="h-8" onClick={() => refetch()}>
          <RotateCcw /> Retry
        </Button>
      </div>
    );
  }
}
