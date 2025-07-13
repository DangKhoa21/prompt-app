import { BookOpenIcon, BotIcon, Compass } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

import { Button } from "@/components/ui/button";
import { SidebarHeader } from "@/components/ui/sidebar";

import { GeneratorMode } from "./enum-generator-mode";

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
      mode: GeneratorMode.NEW_AI,
      icon: <BotIcon />,
      label: "New",
    },
    {
      mode: GeneratorMode.MARKETPLACE,
      icon: <Compass />,
      label: "Marketplace",
    },
    {
      mode: GeneratorMode.TECHNIQUE,
      icon: <BookOpenIcon />,
      label: "Techniques",
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
                className="flex flex-col md:flex-row gap-2 items-center justify-between"
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
