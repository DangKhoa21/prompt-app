import { Compass, Plus } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { SidebarTrigger2 } from "@/components/ui/sidebar2";
import { BetterTooltip } from "@/components/ui/tooltip";
import { ModelSelector } from "./model-selector";

export function ChatHeader({ selectedModelId }: { selectedModelId: string }) {
  return (
    <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background">
      <div className="flex flex-1 items-center gap-2 px-3">
        <SidebarTrigger className="h-7" />

        <Separator orientation="vertical" className="h-4" />

        <BetterTooltip content="New chat">
          <Button variant="ghost" className="h-7 p-2">
            <Plus />
          </Button>
        </BetterTooltip>

        <Separator orientation="vertical" className="h-4" />

        <ModelSelector selectedModelId={selectedModelId} />

        <div className="flex items-center gap-2 ml-auto">
          <BetterTooltip content="Explore">
            <Button variant="ghost" className="h-7 p-2">
              <Compass />
            </Button>
          </BetterTooltip>
          <Separator orientation="vertical" className="h-4" />
          <SidebarTrigger2 className="h-7" />
        </div>
      </div>
    </header>
  );
}
