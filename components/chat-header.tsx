import { Compass, Plus } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export function ChatHeader() {
  return (
    <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background">
      <div className="flex flex-1 items-center gap-2 px-3">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="w-full flex justify-between">
          <Button variant="ghost" className="h-7 p-2">
            <Compass />
            Explore
          </Button>
          <Button variant="ghost" className="h-7 p-2">
            <Plus />
            New chat
          </Button>
        </div>
      </div>
    </header>
  );
}
