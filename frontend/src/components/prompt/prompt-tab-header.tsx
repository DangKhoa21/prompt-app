import { BookOpenIcon, BotIcon, Compass } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

import { Button } from "@/components/ui/button";
import { SidebarHeader } from "@/components/ui/sidebar";

import { GeneratorMode } from "./enum-generator-mode";
import { cn } from "@/lib/utils";

interface PromptTabHeaderProps {
  mode: GeneratorMode;
  onChangeMode: Dispatch<SetStateAction<GeneratorMode>>;
}

export default function PromptTabHeader({
  mode,
  onChangeMode,
}: PromptTabHeaderProps) {
  const tabItems = [
    {
      mode: GeneratorMode.MARKETPLACE,
      icon: <Compass />,
      label: "Marketplace",
      className: "marketplace",
    },
    {
      mode: GeneratorMode.NEW_AI,
      icon: <BotIcon />,
      label: "AI",
      className: "new-ai-prompt",
    },
    {
      mode: GeneratorMode.TECHNIQUE,
      icon: <BookOpenIcon />,
      label: "Techniques",
      className: "techniques-handbook",
    },
  ];

  return (
    <>
      <SidebarHeader className="prompt-editor border-b">
        <div className="flex items-center justify-around">
          {tabItems.map((item) => {
            const isActive = item.mode === mode;
            return (
              <Button
                key={item.mode}
                onClick={() => onChangeMode(item.mode)}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "flex flex-col md:flex-row gap-2 items-center justify-between",
                  item.className
                )}
              >
                {item.icon}
                {isActive && <span className="">{item.label}</span>}
              </Button>
            );
          })}
        </div>
      </SidebarHeader>
    </>
  );
}
