"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export default function PromptResults() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const scrollAreaMaxHeight = expanded
    ? "h-[692px] md:h-[812px]"
    : "h-[180px] md:h-[300px]";

  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

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

  return (
    <div>
      <div className="text-xl mt-8 font-semibold md:mx-2">Example results:</div>
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
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Praesent commodo cursus magna, vel scelerisque nisl
                      consectetur et. Donec sed odio dui. Nulla vitae elit
                      libero, a pharetra augue. Nullam id dolor id nibh
                      ultricies vehicula ut id elit. Curabitur blandit tempus
                      porttitor. Integer posuere erat a ante venenatis dapibus
                      posuere velit aliquet.Lorem ipsum dolor sit amet,
                      consectetur adipiscing elit. Praesent commodo cursus
                      magna, vel scelerisque nisl consectetur et. Donec sed odio
                      dui. Nulla vitae elit libero, a pharetra augue. Nullam id
                      dolor id nibh ultricies vehicula ut id elit. Curabitur
                      blandit tempus porttitor. Integer posuere erat a ante
                      venenatis dapibus posuere velit aliquet.Lorem ipsum dolor
                      sit amet, consectetur adipiscing elit. Praesent commodo
                      cursus magna, vel scelerisque nisl consectetur et. Donec
                      sed odio dui. Nulla vitae elit libero, a pharetra augue.
                      Nullam id dolor id nibh ultricies vehicula ut id elit.
                      Curabitur blandit tempus porttitor. Integer posuere erat a
                      ante venenatis dapibus posuere velit aliquet.Lorem ipsum
                      dolor sit amet, consectetur adipiscing elit. Praesent
                      commodo cursus magna, vel scelerisque nisl consectetur et.
                      Donec sed odio dui. Nulla vitae elit libero, a pharetra
                      augue. Nullam id dolor id nibh ultricies vehicula ut id
                      elit. Curabitur blandit tempus porttitor. Integer posuere
                      erat a ante venenatis dapibus posuere velit aliquet.Lorem
                      ipsum dolor sit amet, consectetur adipiscing elit.
                      Praesent commodo cursus magna, vel scelerisque nisl
                      consectetur et. Donec sed odio dui. Nulla vitae elit
                      libero, a pharetra augue. Nullam id dolor id nibh
                      ultricies vehicula ut id elit. Curabitur blandit tempus
                      porttitor. Integer posuere erat a ante venenatis dapibus
                      posuere velit aliquet.Lorem ipsum dolor sit amet,
                      consectetur adipiscing elit. Praesent commodo cursus
                      magna, vel scelerisque nisl consectetur et. Donec sed odio
                      dui. Nulla vitae elit libero, a pharetra augue. Nullam id
                      dolor id nibh ultricies vehicula ut id elit. Curabitur
                      blandit tempus porttitor. Integer posuere erat a ante
                      venenatis dapibus posuere velit aliquet.Lorem ipsum dolor
                      sit amet, consectetur adipiscing elit. Praesent commodo
                      cursus magna, vel scelerisque nisl consectetur et. Donec
                      sed odio dui. Nulla vitae elit libero, a pharetra augue.
                      Nullam id dolor id nibh ultricies vehicula ut id elit.
                      Curabitur blandit tempus porttitor. Integer posuere erat a
                      ante venenatis dapibus posuere velit aliquet.
                    </div>
                  </ScrollArea>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </ScrollArea>
    </div>
  );
}
