"use client";

import { LoadingSpinner } from "@/components/icons";
import { ArrayConfig } from "@/components/prompt/generator-items/array-config";
import { CreatableCombobox } from "@/components/prompt/generator-items/creatable-combobox";
import { PromptSearch } from "@/components/prompt/prompt-search";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
//import { usePrompt } from "@/context/prompt-context";
//import { usePinPrompt } from "@/features/template";
// import axios from "@/lib/axios";
//import { generateUUID, serializeConfigData } from "@/lib/utils";
import { getPromptWithConfigs } from "@/services/prompt";
//import { createShareOption } from "@/services/share-option";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  ChevronLeft,
  FileQuestion,
  Pin,
  RotateCcw,
  Share2,
} from "lucide-react";
import { useSearchParams } from "@/hooks/useSearchParams";
import { use, useEffect, useState } from "react";
import { sendMessage } from "@/lib/messaging";
//import { toast } from "sonner";

export function PromptGeneratorSidebar() {
  //const { systemInstruction, setSystemInstruction, setPrompt } = usePrompt();
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>(
    {}
  );
  const [textareaValues, setTextareaValues] = useState<Record<string, string>>(
    {}
  );
  const [arrayValues, setArrayValues] = useState<
    Record<string, { id: string; values: string[] }[]>
  >({});

  const searchParams = useSearchParams();
  const promptId = searchParams.get("promptId");

  const { isPending, isError, data, error, refetch } = useQuery({
    queryKey: ["prompts", promptId],
    queryFn: () => getPromptWithConfigs(promptId),
  });

  // const createShareOptionMutation = useMutation({
  //   mutationFn: createShareOption,
  //   onSuccess: () => {
  //     toast.success("Create share option successfully");
  //   },
  //   onError: (e) => {
  //     if (e.message) {
  //       toast.error(e.message);
  //     } else {
  //       toast.error("Something went wrong, please try again!");
  //     }
  //   },
  // });

  // useEffect(() => {
  //   if (!data) return;

  //   const optionId = searchParams.get("optionId");
  //   if (!optionId) return;

  //   (async () => {
  //     try {
  //       const response = await axios.get(`/option/${optionId}`);
  //       const optionData = response.data.data;
  //       const parsedData = JSON.parse(optionData.option);

  //       const newSelected: Record<string, string> = {};
  //       const newTextarea: Record<string, string> = {};
  //       const newArray: Record<string, { id: string; values: string[] }[]> = {};

  //       parsedData.configs.forEach(
  //         (config: { label: string; type: string; value: string }) => {
  //           if (!config || config.value === undefined || config.value === null)
  //             return;

  //           if (config.type === "dropdown" || config.type === "combobox") {
  //             newSelected[config.label] = config.value;
  //           } else if (config.type === "textarea") {
  //             newTextarea[config.label] = config.value;
  //           } else if (config.type === "array") {
  //             const parsedArray = JSON.parse(config.value) as {
  //               id: string;
  //               values: string[];
  //             }[];
  //             newArray[config.label] = parsedArray;
  //           }
  //         },
  //       );

  //       setSelectedValues(newSelected);
  //       setTextareaValues(newTextarea);
  //       setArrayValues(newArray);
  //     } catch (error) {
  //       console.error("Failed to fetch option data:", error);
  //     }
  //   })();
  // }, [data, searchParams]);

  // useEffect(() => {
  //   if (data && data.systemInstruction !== systemInstruction) {
  //     setSystemInstruction(data.systemInstruction as string | null);
  //   }
  // }, [data, systemInstruction, setSystemInstruction]);

  // const pinPromptMutation = usePinPrompt();

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

  const handleSelectChange = (configLabel: string, value: string) => {
    setSelectedValues((prevState) => ({
      ...prevState,
      [configLabel]: value,
    }));
  };

  const handleCreateOption = (configLabel: string, inputValue: string) => {
    const newOption = {
      value: inputValue,
    };

    setSelectedValues((prevState) => ({
      ...prevState,
      [configLabel]: newOption.value,
    }));
  };

  const handleTextareaChange = (configLabel: string, value: string) => {
    setTextareaValues((prevState) => ({
      ...prevState,
      [configLabel]: value,
    }));
  };

  const handlePrompt = (isSending: boolean) => {
    const template = data.stringTemplate;
    let prompt = template;

    data.configs.forEach((config) => {
      prompt = prompt.replace("$", "");
      if (config.type === "dropdown" || config.type === "combobox") {
        if (
          selectedValues[config.label] &&
          selectedValues[config.label] !== "None"
        ) {
          prompt = prompt.replace(
            `{${config.label}}`,
            selectedValues[config.label]
          );
        } else {
          prompt = prompt.replace(`{${config.label}}`, "");
        }
      } else if (config.type === "textarea") {
        if (textareaValues[config.label]) {
          prompt = prompt.replace(
            `{${config.label}}`,
            textareaValues[config.label]
          );
        } else {
          prompt = prompt.replace(`{${config.label}}`, "");
        }
      } else if (config.type === "array") {
        const replaceValue = arrayValues[config.label]
          ? arrayValues[config.label]
              .map((item, index) =>
                item.values
                  .map(
                    (value, labelIndex) =>
                      `\n\t${config.values[labelIndex].value} ${
                        index + 1
                      }: ${value}`
                  )
                  .join("")
              )
              .join("\n")
          : "";

        prompt = prompt.replace(`{${config.label}}`, `${replaceValue}`);
      }
    });

    // Remove only excessive spaces, not newlines "\n"
    prompt = prompt.replace(/ {2,}/g, " ");
    prompt = prompt.replace(/\\n/g, "\n");
    // setPrompt({
    //   id: data.id,
    //   value: prompt,
    //   isSending,
    // });
    browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];

      sendMessage(
        "setPrompt",
        {
          id: data.id,
          value: prompt,
          isSending,
        },
        currentTab.id
      );
    });
  };

  // const handleShare = () => {
  //   if (!promptId) return;

  //   const url = new URL(window.location.href);
  //   const params = new URLSearchParams();

  //   params.set("promptId", promptId);

  //   const serializedData = serializeConfigData({
  //     promptId: promptId,
  //     data,
  //     selectedValues,
  //     textareaValues,
  //     arrayValues,
  //   });

  //   const createOptionPromisePromise = createShareOptionMutation.mutateAsync({
  //     optionId: generateUUID(),
  //     option: serializedData,
  //   });

  //   toast.promise(createOptionPromisePromise, {
  //     loading: "Creating share option...",
  //     success: (optionId) => {
  //       params.set("optionId", optionId);
  //       url.search = params.toString();

  //       navigator.clipboard.writeText(url.toString());

  //       return "Creating share option successfully, shareable URL copied to clipboard!";
  //     },
  //     error: (e) => {
  //       console.error(e);
  //       return "Failed to create share option";
  //     },
  //   });
  // };

  return (
    <div className="flex h-full w-full flex-col">
      <SidebarHeader className="pb-0">
        <div className="flex justify-between items-center p-2">
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="h-8 w-8"
              onClick={() => window.history.back()}
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
                // onClick={() => handleShare()}
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                className="h-8 w-8"
                // onClick={() => pinPromptMutation.mutate(data.id)}
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

        {data.configs?.map((config) => (
          <SidebarGroup key={config.label}>
            <SidebarGroupLabel className="flex justify-between">
              <Label htmlFor={config.label.toLowerCase()}>{config.label}</Label>
              <Button variant="ghost" className="h-8 w-8 mr-2">
                <FileQuestion></FileQuestion>
              </Button>
            </SidebarGroupLabel>

            <SidebarGroupContent className="px-2">
              {config.type === "combobox" ? (
                <CreatableCombobox
                  options={config.values}
                  value={selectedValues[config.label]}
                  onChange={(value) => handleSelectChange(config.label, value)}
                  placeholder={`Select a ${config.label.toLowerCase()}`}
                  onCreateOption={(inputValue) =>
                    handleCreateOption(config.label, inputValue)
                  }
                />
              ) : config.type === "dropdown" ? (
                <Select
                  onValueChange={(value) =>
                    handleSelectChange(config.label, value)
                  }
                >
                  <SelectTrigger id={config.label}>
                    <SelectValue
                      placeholder={
                        selectedValues[config.label] ??
                        `Select a ${config.label.toLowerCase()}`
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">None</SelectItem>
                    {config.values.map((value) => (
                      <SelectItem key={value.id} value={value.value}>
                        {value.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : config.type === "textarea" ? (
                <Textarea
                  id={config.label}
                  placeholder={`Input your content`}
                  value={textareaValues[config.label]}
                  onChange={(e) =>
                    handleTextareaChange(config.label, e.target.value)
                  }
                  // className={config.className}
                />
              ) : config.type === "array" ? (
                <>
                  <ArrayConfig
                    id={config.label}
                    labels={config.values.map((value) => {
                      return value.value;
                    })}
                    values={arrayValues[config.label]}
                    setArrayValues={setArrayValues}
                  ></ArrayConfig>
                </>
              ) : null}
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {data.id !== "1" && (
        <SidebarFooter className="sticky bottom-0 bg-background">
          <div className="flex justify-around gap-4 p-2">
            <Button className="w-full" onClick={() => handlePrompt(false)}>
              Generate
            </Button>
            {/* <Button className="w-1/2" onClick={() => handlePrompt(true)}>
              Send
            </Button> */}
          </div>
        </SidebarFooter>
      )}
    </div>
  );
}
