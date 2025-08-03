import { LoadingSpinner } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { usePrompt } from "@/context/prompt-context";
import { ConfigType, usePinPrompt } from "@/features/template";
import { generateUUID } from "@/lib/utils";
import { serializeOptionConfigData } from "@/lib/utils/utils.details";
import { PromptWithConfigs } from "@/services/prompt/interface";
import { createShareOption } from "@/services/share-option";
import { Label } from "@radix-ui/react-label";
import {
  QueryObserverResult,
  RefetchOptions,
  useMutation,
} from "@tanstack/react-query";
import axios from "axios";
import { Pin, RotateCcw, Share2, StepBackIcon } from "lucide-react";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { toast } from "sonner";
import RenderConfigInput from "../generator-items/generator-config-item";
import {
  ArrayConfigInputState,
  ConfigInputState,
  PromptFillState,
} from "../hooks/usePromptConfigState";
import { PromptSearch } from "../prompt-search";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface MarketplaceTabContentProps {
  promptId: string;
  optionId: string;
  data: PromptWithConfigs | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<PromptWithConfigs, Error>>;
  selectedValues: ConfigInputState;
  setSelectedValues: Dispatch<SetStateAction<ConfigInputState>>;
  textareaValues: ConfigInputState;
  setTextareaValues: Dispatch<SetStateAction<ConfigInputState>>;
  arrayValues: ArrayConfigInputState;
  setArrayValues: Dispatch<SetStateAction<ArrayConfigInputState>>;
  isFilled: PromptFillState;
}

export function MarketplaceTabContent({
  promptId,
  optionId,
  data,
  isLoading,
  isError,
  error,
  refetch,
  selectedValues,
  setSelectedValues,
  textareaValues,
  setTextareaValues,
  arrayValues,
  setArrayValues,
  isFilled,
}: MarketplaceTabContentProps) {
  const { setSystemInstruction } = usePrompt();
  const router = useRouter();
  const pathName = usePathname();

  // -- Handlers --
  const pinPromptMutation = usePinPrompt();
  const createShareOptionMutation = useMutation({
    mutationFn: createShareOption,
    onSuccess: () => toast.success("Create share option successfully"),
    onError: (e) =>
      toast.error(e.message || "Something went wrong, please try again!"),
  });

  const fetchOptionData = useCallback(async () => {
    try {
      const { data: res } = await axios.get(`/option/${optionId}`);
      const parsed = JSON.parse(res.data.option);

      const newSelected: ConfigInputState = {};
      const newTextarea: ConfigInputState = {};
      const newArray: ArrayConfigInputState = {};

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
  }, [optionId, setArrayValues, setSelectedValues, setTextareaValues]);

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

  const hasSetInstructionRef = useRef(false);

  // -- Effects --
  useEffect(() => {
    if (!data || hasSetInstructionRef.current) return;

    setSystemInstruction(data.systemInstruction ?? null);
    hasSetInstructionRef.current = true;
  }, [data, setSystemInstruction]);

  useEffect(() => {
    if (!optionId) return;

    fetchOptionData();
  }, [fetchOptionData, optionId]);

  if (isLoading) {
    return (
      <div className="flex h-full justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <>
        <SidebarGroup>
          <SidebarGroupLabel className="flex justify-between items-center gap-1">
            <Label htmlFor="prompt-search">
              Error loading prompt. Please try again!
            </Label>
            <Button onClick={() => refetch()} variant="ghost" size="icon">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-3">
            <p className="text-sm text-destructive">
              Failed to load prompt: {error!.message}
            </p>
          </SidebarGroupContent>
        </SidebarGroup>
      </>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <>
      <SidebarGroup>
        {data.id !== "1" && (
          <SidebarGroupLabel className="py-6">
            <div className="flex w-full justify-between items-center gap-2">
              <PromptSearch noWrap />
              <Button
                variant="ghost"
                className="h-6 w-6"
                onClick={() => {
                  router.push(pathName);
                }}
              >
                <StepBackIcon />
              </Button>
            </div>
          </SidebarGroupLabel>
        )}

        <SidebarGroupContent className="flex items-center justify-between px-3 py-3">
          <div className=" text-base leading-tight">
            <Link
              href={`/prompts/${data.title.toLowerCase().replace(/\s+/g, "-")}-pid${data.id}`}
            >
              <span className="font-semibold">{data.title}</span>
            </Link>
          </div>
          {data.id !== "1" && (
            <div className="line-clamp-1 text-nowrap">
              <Button variant="ghost" className="h-8 w-8" onClick={handleShare}>
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
        </SidebarGroupContent>

        <SidebarGroupContent className="px-3">
          <p className="text-sm italic">{data.description}</p>
        </SidebarGroupContent>
      </SidebarGroup>

      {data.id === "1" && (
        <SidebarGroup>
          <SidebarGroupLabel>
            <Label htmlFor="prompt-search">
              {data.id === "1"
                ? "Explore the marketplace"
                : "Search for another prompt"}
            </Label>
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <PromptSearch />
          </SidebarGroupContent>
        </SidebarGroup>
      )}

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
    </>
  );
}
