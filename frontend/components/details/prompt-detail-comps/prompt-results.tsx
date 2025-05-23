"use client";

import { Markdown } from "@/components/markdown";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, deserializeResultConfigData } from "@/lib/utils";
import { Prompt } from "@/services/prompt/interface";
import { Copy } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

interface PromptResultsProps {
  promptData: Prompt;
}

export default function PromptResults({ promptData }: PromptResultsProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const scrollAreaMaxHeight = expanded
    ? "h-[692px] md:h-[812px]"
    : "h-[180px] md:h-[300px]";

  const [activeTab, setActiveTab] = useState("prompt");
  const itemRefs = useRef(new Map<string, HTMLDivElement>());

  const setItemRef = (key: string) => (el: HTMLDivElement | null) => {
    if (el) itemRefs.current.set(key, el);
  };

  // Set tab with hash URL
  useEffect(() => {
    const hash = window.location.hash?.replace("#", "");
    if (hash && ["prompt", "system", "examples"].includes(hash)) {
      setActiveTab(hash);
    }
  }, []);

  // Scroll into the selected example result
  useEffect(() => {
    if (expanded && itemRefs.current.get(expanded)) {
      const el = itemRefs.current.get(expanded);

      const timeout = setTimeout(() => {
        el?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [expanded]);

  const handleCopyPrompt = () => {
    navigator?.clipboard?.writeText(promptData.stringTemplate);
    toast.success("Prompt copied to clipboard!");
  };

  const handleCopySystemInstruction = () => {
    navigator?.clipboard?.writeText(promptData.systemInstruction as string);
    toast.success("System instruction copied to clipboard!");
  };

  const deserializedData = useMemo(() => {
    if (!promptData.exampleResult) return null;
    return deserializeResultConfigData(promptData.exampleResult);
  }, [promptData.exampleResult]);

  const configValues = useMemo(() => {
    if (!deserializedData) return [];

    const entries: { label: string; value: string }[] = [];

    Object.entries(deserializedData.selectedValues).forEach(([key, value]) => {
      entries.push({ label: key, value });
    });

    Object.entries(deserializedData.textareaValues).forEach(([key, value]) => {
      entries.push({ label: key, value });
    });

    Object.entries(deserializedData.arrayValues).forEach(([key, array]) => {
      array.forEach((item, index) => {
        entries.push({
          label: `${key} ${index + 1}`,
          value: item.values.join(", "),
        });
      });
    });

    return entries;
  }, [deserializedData]);

  return (
    <div className="bg-background rounded-lg">
      <Tabs
        value={activeTab}
        onValueChange={(val) => {
          setActiveTab(val);
          window.location.hash = val;
        }}
        className="rounded-lg shadow-sm p-6"
      >
        <TabsList
          className={cn(
            "grid mb-4 h-fit",
            deserializedData ? "grid-cols-3" : "grid-cols-2",
          )}
        >
          <TabsTrigger value="prompt" className="text-wrap h-full">
            Prompt
          </TabsTrigger>
          <TabsTrigger value="system" className="text-wrap h-full">
            System Instruction
          </TabsTrigger>
          {deserializedData && (
            <TabsTrigger value="examples" className="text-wrap h-full">
              Examples
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="prompt" className="space-y-4">
          <div className="p-4 rounded-md border whitespace-pre-wrap">
            {promptData.stringTemplate}
          </div>
          <Button
            variant="outline"
            aria-label="Copy Prompt"
            onClick={handleCopyPrompt}
            className="w-full"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Prompt
          </Button>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="p-4 rounded-md border whitespace-pre-wrap">
            {promptData.systemInstruction ??
              "System instruction has not yet been configured!"}
          </div>
          <Button
            variant="outline"
            onClick={handleCopySystemInstruction}
            disabled={!promptData.systemInstruction}
            className="w-full"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy System Instruction
          </Button>
        </TabsContent>

        {deserializedData && (
          <TabsContent value="examples" className="space-y-6">
            <ScrollArea
              className={cn(
                "transition-all duration-300 md:p-4",
                scrollAreaMaxHeight,
              )}
            >
              <Accordion
                type="single"
                collapsible
                value={expanded || ""}
                onValueChange={(val) => setExpanded(val || null)}
              >
                <AccordionItem
                  key={`example-result-${deserializedData.promptId}`}
                  value={deserializedData.promptId}
                >
                  <div ref={setItemRef(deserializedData.promptId)}>
                    <AccordionTrigger>Example Result</AccordionTrigger>
                  </div>
                  <AccordionContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Input:</p>
                      <div className="p-4 rounded-md border text-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {configValues.map(({ label, value }) => (
                          <>
                            <dt className="font-semibold">{label}</dt>
                            <dd
                              className={cn(
                                "md:col-span-2",
                                value ? "" : "text-red-400",
                              )}
                            >
                              {value ?? "Not selected"}
                            </dd>
                          </>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Output:</p>
                      <ScrollArea className="border rounded-lg p-2 md:p-8 h-[32rem]">
                        <Markdown>{deserializedData.exampleResult}</Markdown>
                      </ScrollArea>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </ScrollArea>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
