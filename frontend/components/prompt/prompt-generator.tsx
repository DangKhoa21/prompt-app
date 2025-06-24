"use client";

import { Technique } from "@/app/(home)/techniques/technique-type";
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
import { usePinPrompt } from "@/features/template";
import axios from "@/lib/axios/axiosWithAuth";
import { generateUUID } from "@/lib/utils";
import { serializeOptionConfigData } from "@/lib/utils/utils.details";
import {
  fillPromptTemplate,
  validateFilledConfigs,
} from "@/lib/utils/utils.generate-prompt";
import { getPromptWithConfigs } from "@/services/prompt";
import { createShareOption } from "@/services/share-option";
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
import { useEffect, useState } from "react";
import { toast } from "sonner";

type GeneratorMode = "choose" | "marketplace" | "new-ai" | "technique";

export function PromptGeneratorSidebar() {
  const [mode, setMode] = useState<GeneratorMode>("choose");

  const [selectedTechnique, setSelectedTechnique] = useState<Technique | null>(
    null,
  );

  const { systemInstruction, setSystemInstruction, setPrompt } = usePrompt();
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>(
    {},
  );
  const [textareaValues, setTextareaValues] = useState<Record<string, string>>(
    {},
  );
  const [arrayValues, setArrayValues] = useState<
    Record<string, { id: string; values: string[] }[]>
  >({});
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
  });

  const createShareOptionMutation = useMutation({
    mutationFn: createShareOption,
    onSuccess: () => {
      toast.success("Create share option successfully");
    },
    onError: (e) => {
      if (e.message) {
        toast.error(e.message);
      } else {
        toast.error("Something went wrong, please try again!");
      }
    },
  });

  // Set share configs
  useEffect(() => {
    if (!data) return;

    const optionId = searchParams.get("optionId");
    if (!optionId) return;

    setMode("marketplace");

    (async () => {
      try {
        const response = await axios.get(`/option/${optionId}`);
        const optionData = response.data.data;
        const parsedData = JSON.parse(optionData.option);

        const newSelected: Record<string, string> = {};
        const newTextarea: Record<string, string> = {};
        const newArray: Record<string, { id: string; values: string[] }[]> = {};

        parsedData.configs.forEach(
          (config: { label: string; type: string; value: string }) => {
            if (!config || config.value === undefined || config.value === null)
              return;

            if (config.type === "dropdown" || config.type === "combobox") {
              newSelected[config.label] = config.value;
            } else if (config.type === "textarea") {
              newTextarea[config.label] = config.value;
            } else if (config.type === "array") {
              const parsedArray = JSON.parse(config.value) as {
                id: string;
                values: string[];
              }[];
              newArray[config.label] = parsedArray;
            }
          },
        );

        setSelectedValues(newSelected);
        setTextareaValues(newTextarea);
        setArrayValues(newArray);
      } catch (error) {
        console.error("Failed to fetch option data:", error);
      }
    })();
  }, [data, searchParams]);

  useEffect(() => {
    if (data && data.systemInstruction !== systemInstruction) {
      setSystemInstruction(data.systemInstruction as string | null);
    }
  }, [data, systemInstruction, setSystemInstruction]);

  // Check filled configs
  useEffect(() => {
    if (!data) return;

    setIsFilled(
      validateFilledConfigs(
        data.configs,
        selectedValues,
        textareaValues,
        arrayValues,
      ),
    );
  }, [arrayValues, data, selectedValues, textareaValues]);

  const pinPromptMutation = usePinPrompt();

  if (mode === "choose") {
    return (
      <>
        <SidebarContent className="prompt-menu p-4 flex flex-col items-center justify-center gap-8">
          <h2 className="text-lg font-semibold">What would you like to do?</h2>
          <div className="flex flex-col items-center justify-center gap-4">
            <Button
              className="new-ai-prompt w-40"
              variant="outline"
              onClick={() => setMode("new-ai")}
            >
              New Prompt with AI
            </Button>
            <Button
              className="marketplace w-40"
              variant="outline"
              onClick={() => setMode("marketplace")}
            >
              Marketplace
            </Button>
            <Button
              className="techniques-handbook w-40"
              variant="outline"
              onClick={() => setMode("technique")}
            >
              Techniques handbook
            </Button>
          </div>
        </SidebarContent>
      </>
    );
  }

  if (mode === "technique") {
    return (
      <>
        <SidebarHeader className="prompt-editor pb-0">
          <div className="flex justify-between items-center p-2">
            <div className="flex items-center">
              <Button
                variant="ghost"
                className="h-8 w-8"
                onClick={() => {
                  if (!selectedTechnique) {
                    setMode("choose");
                    return;
                  }
                  setSelectedTechnique(null);
                }}
              >
                <ChevronLeft />
              </Button>
              <div className="text-base leading-tight ml-2">
                <span className="font-semibold">
                  {selectedTechnique ? "Back to techniques" : "Techniques"}
                </span>
              </div>
            </div>
            <div>
              <Link href="/techniques" target="_blank">
                <ExternalLinkIcon className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-4 overflow-y-auto">
          {!selectedTechnique ? (
            <>
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
            </>
          ) : (
            <>
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
                    id: "technique-" + selectedTechnique.id,
                    value: selectedTechnique.template,
                    isSending: false,
                  });
                  toast.success("Technique template inserted into prompt!");
                }}
              >
                Use This Template
              </Button>
            </>
          )}
        </SidebarContent>
      </>
    );
  }

  if (isPending) {
    return (
      <div className="flex h-full justify-center items-center mt-4">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-2 justify-center text-center items-center mt-4">
        <p className="text-sm">Please try again! {error.message}</p>
        <Button variant="ghost" className="h-8" onClick={() => refetch()}>
          <RotateCcw />
          Retry
        </Button>
      </div>
    );
  }

  const handlePrompt = (isSending: boolean) => {
    const template = data.stringTemplate;
    const configs = data.configs;
    const prompt = fillPromptTemplate({
      template,
      configs,
      selectedValues,
      textareaValues,
      arrayValues,
    });

    setPrompt({
      id: data.id,
      value: prompt,
      isSending,
    });
  };

  const handleShare = () => {
    if (!promptId) return;

    const url = new URL(window.location.href);
    const params = new URLSearchParams();

    params.set("promptId", promptId);

    const serializedData = serializeOptionConfigData({
      promptId: promptId,
      configs: data.configs,
      selectedValues,
      textareaValues,
      arrayValues,
    });

    const createOptionPromisePromise = createShareOptionMutation.mutateAsync({
      optionId: generateUUID(),
      option: serializedData,
    });

    toast.promise(createOptionPromisePromise, {
      loading: "Creating share option...",
      success: (optionId) => {
        params.set("optionId", optionId);
        url.search = params.toString();

        navigator.clipboard.writeText(url.toString());

        return "Creating share option successfully, shareable URL copied to clipboard!";
      },
      error: (e) => {
        console.error(e);
        return "Failed to create share option";
      },
    });
  };

  return (
    <>
      <SidebarHeader className="prompt-editor pb-0">
        <div className="flex justify-between items-center p-2">
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="h-8 w-8"
              onClick={() => setMode("choose")}
            >
              <ChevronLeft />
            </Button>
            <div className="text-base leading-tight ml-2">
              <span className="font-semibold">{data.title}</span>
            </div>
          </div>
          {data.id !== "1" && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                className="h-8 w-8"
                onClick={() => handleShare()}
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                className="h-8 w-8"
                onClick={() => pinPromptMutation.mutate(data.id)}
              >
                <Pin />
              </Button>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        <SidebarGroup>
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
            content={`Unfilled required config(s): ${isFilled.unfilledConfigs
              .map((configName) => `${configName}`)
              .join(", ")}`}
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
