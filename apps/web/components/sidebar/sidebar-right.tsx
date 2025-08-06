import * as React from "react";

import { Sidebar2, SidebarRail2 } from "@workspace/ui/components/sidebar2";
import { PromptGeneratorSidebar } from "@/components/prompt/prompt-generator-sidebar";

export function SidebarRight({
  ...props
}: React.ComponentProps<typeof Sidebar2>) {
  return (
    <Sidebar2
      collapsible="offcanvas"
      side="right"
      className="hidden lg:flex top-0 h-svh border-l"
      {...props}
    >
      <PromptGeneratorSidebar />
      <SidebarRail2 />
    </Sidebar2>
  );
}
