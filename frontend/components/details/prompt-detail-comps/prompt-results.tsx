"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
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
    if (!promptData) return;
    navigator.clipboard.writeText(promptData.stringTemplate);
    toast.success("Prompt copied to clipboard!");
  };
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
            onClick={() =>
              navigator.clipboard.writeText(promptData.systemInstruction ?? "")
            }
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
              {[...Array(10)].map((_, i) => {
                const itemKey = `item-${i}`;
                return (
                  <AccordionItem key={`test-${itemKey}`} value={itemKey}>
                    <div
                      ref={(el) => {
                        itemRefs.current[itemKey] = el;
                      }}
                    >
                      <AccordionTrigger>Result {i + 1}</AccordionTrigger>
                    </div>
                    <AccordionContent>
                      <ScrollArea className="border rounded-lg m-2 p-4 md:p-8 h-[32rem]">
                        <div>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Praesent commodo cursus magna, vel scelerisque
                          nisl consectetur et. Donec sed odio dui. Nulla vitae
                          elit libero, a pharetra augue. Nullam id dolor id nibh
                          ultricies vehicula ut id elit. Curabitur blandit
                          tempus porttitor. Integer posuere erat a ante
                          venenatis dapibus posuere velit aliquet.Lorem ipsum
                          dolor sit amet, consectetur adipiscing elit. Praesent
                          commodo cursus magna, vel scelerisque nisl consectetur
                          et. Donec sed odio dui. Nulla vitae elit libero, a
                          pharetra augue. Nullam id dolor id nibh ultricies
                          vehicula ut id elit. Curabitur blandit tempus
                          porttitor. Integer posuere erat a ante venenatis
                          dapibus posuere velit aliquet.Lorem ipsum dolor sit
                          amet, consectetur adipiscing elit. Praesent commodo
                          cursus magna, vel scelerisque nisl consectetur et.
                          Donec sed odio dui. Nulla vitae elit libero, a
                          pharetra augue. Nullam id dolor id nibh ultricies
                          vehicula ut id elit. Curabitur blandit tempus
                          porttitor. Integer posuere erat a ante venenatis
                          dapibus posuere velit aliquet.Lorem ipsum dolor sit
                          amet, consectetur adipiscing elit. Praesent commodo
                          cursus magna, vel scelerisque nisl consectetur et.
                          Donec sed odio dui. Nulla vitae elit libero, a
                          pharetra augue. Nullam id dolor id nibh ultricies
                          vehicula ut id elit. Curabitur blandit tempus
                          porttitor. Integer posuere erat a ante venenatis
                          dapibus posuere velit aliquet.Lorem ipsum dolor sit
                          amet, consectetur adipiscing elit. Praesent commodo
                          cursus magna, vel scelerisque nisl consectetur et.
                          Donec sed odio dui. Nulla vitae elit libero, a
                          pharetra augue. Nullam id dolor id nibh ultricies
                          vehicula ut id elit. Curabitur blandit tempus
                          porttitor. Integer posuere erat a ante venenatis
                          dapibus posuere velit aliquet.Lorem ipsum dolor sit
                          amet, consectetur adipiscing elit. Praesent commodo
                          cursus magna, vel scelerisque nisl consectetur et.
                          Donec sed odio dui. Nulla vitae elit libero, a
                          pharetra augue. Nullam id dolor id nibh ultricies
                          vehicula ut id elit. Curabitur blandit tempus
                          porttitor. Integer posuere erat a ante venenatis
                          dapibus posuere velit aliquet.Lorem ipsum dolor sit
                          amet, consectetur adipiscing elit. Praesent commodo
                          cursus magna, vel scelerisque nisl consectetur et.
                          Donec sed odio dui. Nulla vitae elit libero, a
                          pharetra augue. Nullam id dolor id nibh ultricies
                          vehicula ut id elit. Curabitur blandit tempus
                          porttitor. Integer posuere erat a ante venenatis
                          dapibus posuere velit aliquet.
                        </div>
                      </ScrollArea>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </ScrollArea>
          <div>{JSON.stringify(promptData.exampleResult ?? "No result")}</div>
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
