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
import {
  cn,
  deserializeResultConfigData,
  ExampleResultOutput,
} from "@/lib/utils";
import { Prompt } from "@/services/prompt/interface";
import { Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface PromptResultsProps {
  promptData: Prompt;
}

export default function PromptResults({ promptData }: PromptResultsProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const scrollAreaMaxHeight = expanded
    ? "h-[692px] md:h-[812px]"
    : "h-[180px] md:h-[300px]";

  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [activeTab, setActiveTab] = useState("prompt");

  useEffect(() => {
    if (expanded && itemRefs.current[expanded]) {
      const el = itemRefs.current[expanded];

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
    navigator.clipboard.writeText(promptData.stringTemplate);
    toast.success("Prompt copied to clipboard!");
  };

  const handleCopySystemInstruction = () => {
    navigator.clipboard.writeText(promptData.systemInstruction as string);
    toast.success("System instruction copied to clipboard!");
  };

  let deserializedData: ExampleResultOutput | null = null;

  const configValues: Record<string, string> = {};

  if (promptData.exampleResult) {
    deserializedData = deserializeResultConfigData(promptData.exampleResult);

    Object.entries(deserializedData.selectedValues).forEach(([key, value]) => {
      configValues[key] = value;
    });

    Object.entries(deserializedData.textareaValues).forEach(([key, value]) => {
      configValues[key] = value;
    });

    Object.entries(deserializedData.arrayValues).forEach(([key, value]) => {
      configValues[key] = value
        .map((item, index) =>
          item.values
            .map((value) => `${key} ${index + 1}: ${value}`)
            .join("\n"),
        )
        .join("\n\n");
    });
  }

  return (
    <div className="bg-background rounded-lg">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="rounded-lg shadow-sm p-6"
      >
        <TabsList className="grid grid-cols-3 mb-4 h-fit">
          <TabsTrigger value="prompt" className="text-wrap h-full">
            Prompt
          </TabsTrigger>
          <TabsTrigger value="system" className="text-wrap h-full">
            System Instruction
          </TabsTrigger>
          <TabsTrigger value="examples" className="text-wrap h-full">
            Examples
          </TabsTrigger>
        </TabsList>

        <TabsContent value="prompt" className="space-y-4">
          <div className="p-4 rounded-md border whitespace-pre-wrap">
            {promptData.stringTemplate}
          </div>
          <Button
            variant="outline"
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
              {deserializedData && (
                <AccordionItem
                  key={`example-result-${deserializedData.promptId}`}
                  value={deserializedData.promptId}
                >
                  <div
                    ref={(el) => {
                      itemRefs.current[deserializedData.promptId] = el;
                    }}
                  >
                    <AccordionTrigger>Example Result</AccordionTrigger>
                  </div>
                  <AccordionContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Input:</p>
                      <div className="p-4 rounded-md border text-sm grid grid-cols-2 gap-2">
                        {Object.entries(configValues).map(([key, value]) => {
                          return (
                            <div key={`${key}`}>
                              {key}: {value}
                            </div>
                          );
                        })}
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
              )}
            </Accordion>
          </ScrollArea>
          {/* {promptData.examples.map((example) => ( */}
          {/*   <div key={example.id} className="space-y-4"> */}
          {/*     <h3 className="font-medium">{example.title}</h3> */}
          {/**/}
          {/*     <div> */}
          {/*       <p className="text-sm font-medium mb-2">Input:</p> */}
          {/*       <div className="bg-slate-50 p-4 rounded-md border text-sm">{example.input}</div> */}
          {/*     </div> */}
          {/**/}
          {/*     <div> */}
          {/*       <p className="text-sm font-medium mb-2">Output:</p> */}
          {/*       <div className="bg-slate-50 p-4 rounded-md border text-sm max-h-96 overflow-y-auto whitespace-pre-wrap"> */}
          {/*         {example.output} */}
          {/*       </div> */}
          {/*     </div> */}
          {/**/}
          {/*     <Separator /> */}
          {/*   </div> */}
          {/* ))} */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
