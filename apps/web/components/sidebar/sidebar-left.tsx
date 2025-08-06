"use client";

import { BotMessageSquare } from "lucide-react";
import * as React from "react";

import { LoadingSpinner } from "@/components/icons";
import { Logo } from "@/components/logo";
import { NavChats } from "@/components/nav/nav-chats";
import { NavPrompts } from "@/components/nav/nav-prompts";
import { NavUser } from "@/components/nav/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@workspace/ui/components/sidebar";
import { useAuth } from "@/context/auth-context";

// This is sample data.
const data = {
  logoInfo: {
    name: "Prompts App",
    logo: BotMessageSquare,
  },
};

export function SidebarLeft({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { isAuthenticated } = useAuth();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Logo logoInfo={data.logoInfo} />
      </SidebarHeader>
      <React.Suspense fallback={<LoadingSpinner />}>
        <SidebarContent>
          <NavPrompts isAuthenticated={isAuthenticated} />
          <NavChats isAuthenticated={isAuthenticated} />
        </SidebarContent>
      </React.Suspense>
      <SidebarFooter>
        <NavUser isAuthenticated={isAuthenticated} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
