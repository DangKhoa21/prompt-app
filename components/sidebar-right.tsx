import * as React from "react";

import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { PromptGeneratorSidebar } from "@/components/prompt-generator";

export function SidebarRight({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="none"
      side="right"
      className="w-[24rem] sticky hidden lg:flex top-0 h-svh border-l"
      {...props}
    >
      <SidebarContent>
        <PromptGeneratorSidebar />
      </SidebarContent>
    </Sidebar>
  );
}
