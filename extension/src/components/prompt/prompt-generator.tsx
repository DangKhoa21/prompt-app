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
import { WebDropdown } from "@/components/web-dropdown";
//import { usePrompt } from "@/context/prompt-context";
import { usePinPrompt, useUnpinPrompt } from "@/features/template";
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
import { Pin, PinOff, RotateCcw, Share2 } from "lucide-react";
import { useSearchParams } from "@/hooks/useSearchParams";
import { useEffect, useState } from "react";
import { sendMessage } from "@/lib/messaging";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";

export function PromptGeneratorSidebar() {
  const { isAuthenticated } = useAuth();
  //const { systemInstruction, setSystemInstruction, setPrompt } = usePrompt();
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

  // useEffect(() => {
  //   if (data && data.systemInstruction !== systemInstruction) {
  //     setSystemInstruction(data.systemInstruction as string | null);
  //   }
  // }, [data, systemInstruction, setSystemInstruction]);

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
  const unpinPromptMutation = useUnpinPrompt();

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
    if (!data) return;
    const template = data.stringTemplate;
    const configs = data.configs;
    const prompt = fillPromptTemplate({
      template,
      configs,
      selectedValues,
      textareaValues,
      arrayValues,
    });

    browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];

      try {
        sendMessage(
          "setPrompt",
          {
            id: data.id,
            value: prompt,
            isSending,
          },
          currentTab.id,
        );
      } catch (err) {
        console.error("Failed to send message to content script:", err);
        toast.error(
          "Failed to set prompt in the current tab. Please refresh the page.",
        );
      }
    });
  };

  const handleShare = () => {
    if (!promptId) return;

    browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      const url = new URL(currentTab.url || "");
      // clear existing search params
      url.search = "";
      const params = new URLSearchParams(url.search);
      params.set("promptId", promptId);
      if (currentTab) {
        const serializedData = serializeOptionConfigData({
          promptId: promptId,
          configs: data.configs,
          selectedValues,
          textareaValues,
          arrayValues,
        });

        const createOptionPromisePromise =
          createShareOptionMutation.mutateAsync({
            optionId: generateUUID(),
            option: serializedData,
          });

        toast.promise(createOptionPromisePromise, {
          loading: "Creating share option...",
          success: (optionId) => {
            params.set("optionId", optionId);
            url.search = params.toString();

            const encodedUrl = encodeURIComponent(url.toString());
            const sharedUrl = `https://www.promptcrafter.studio/chat?redirect=${encodedUrl}`;
            navigator.clipboard.writeText(sharedUrl);

            return "Creating share option successfully, shareable URL copied to clipboard!";
          },
          error: (e) => {
            console.error(e);
            return "Failed to create share option";
          },
        });
      }
    });
  };

  return (
    <div className="flex h-full w-full flex-col">
      <SidebarHeader className="pb-0">
        <div className="flex justify-between items-center p-2">
          <div className="flex items-center">
            <WebDropdown />
          </div>
          {data.id !== "1" && (
            <div className="flex gap-2">
              <BetterTooltip content="Share & copy">
                <Button
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => handleShare()}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </BetterTooltip>
              {isAuthenticated && (
                <>
                  <BetterTooltip content="Add to pins">
                    <Button
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => pinPromptMutation.mutate(data.id)}
                    >
                      <Pin />
                    </Button>
                  </BetterTooltip>
                  <BetterTooltip content="Remove from pins">
                    <Button
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => unpinPromptMutation.mutate(data.id)}
                    >
                      <PinOff />
                    </Button>
                  </BetterTooltip>
                </>
              )}
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        <SidebarGroup>
          <SidebarGroupContent className="px-4">
            <div className="text-base leading-tight">
              <span className="font-semibold">{data.title}</span>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

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
        <SidebarFooter className="sticky bottom-0 bg-background">
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
              className="w-full"
              disabled={!isFilled.isValid}
              onClick={() => handlePrompt(false)}
            >
              Generate
            </Button>
          </div>
        </SidebarFooter>
      )}
    </div>
  );
}

// export function PromptGeneratorSidebar() {
//   const searchParams = useSearchParams();
//   const queryClient = useQueryClient();
//
//   const filter = { tagId: "01973620-6293-7113-a594-c32275e3b100" };
//   queryClient.prefetchQuery({
//     queryKey: ["prompts", filter],
//     queryFn: () => getPrompts({ pageParam: "", filter }),
//   });
//
//   const promptId = searchParams.get("promptId") ?? "";
//   const optionId = searchParams.get("optionId") ?? "";
//
//   const [selectedTechnique, setSelectedTechnique] =
//     useState<TechWithLink | null>(null);
//   const [mode, setMode] = useState<GeneratorMode>(GeneratorMode.MARKETPLACE);
//
//   useEffect(() => {
//     if (promptId || optionId) {
//       setMode(GeneratorMode.MARKETPLACE);
//     }
//   }, [optionId, promptId]);
//
//   const { data, isLoading, isError, error, refetch } =
//     usePromptConfigsData(promptId);
//   const {
//     selectedValues,
//     setSelectedValues,
//     textareaValues,
//     setTextareaValues,
//     arrayValues,
//     setArrayValues,
//     isFilled,
//   } = usePromptConfigState(data?.configs ?? []);
//
//   const [idea, setIdea] = useState<string>("");
//
//   // -- Render --
//   return (
//     <>
//       <PromptTabHeader mode={mode} onChangeMode={setMode} />
//
//       <SidebarContent className="prompt-generator">
//         {mode === "marketplace" ? (
//           <MarketplaceTabContent
//             promptId={promptId}
//             optionId={optionId}
//             data={data}
//             isLoading={isLoading}
//             isError={isError}
//             error={error}
//             refetch={refetch}
//             selectedValues={selectedValues}
//             setSelectedValues={setSelectedValues}
//             textareaValues={textareaValues}
//             setTextareaValues={setTextareaValues}
//             arrayValues={arrayValues}
//             setArrayValues={setArrayValues}
//             isFilled={isFilled}
//           />
//         ) : mode === "new-ai" ? (
//           <NewTabContent idea={idea} setIdea={setIdea} />
//         ) : mode === "technique" ? (
//           <HydrationBoundary state={dehydrate(queryClient)}>
//             <TechniqueTabContent
//               selectedTechnique={selectedTechnique}
//               setSelectedTechnique={setSelectedTechnique}
//             />
//           </HydrationBoundary>
//         ) : null}
//       </SidebarContent>
//
//       <PromptTabFooter
//         mode={mode}
//         promptId={promptId}
//         idea={idea}
//         data={data}
//         selectedValues={selectedValues}
//         textareaValues={textareaValues}
//         arrayValues={arrayValues}
//         isFilled={isFilled}
//         selectedTechnique={selectedTechnique}
//       />
//     </>
//   );
// }
