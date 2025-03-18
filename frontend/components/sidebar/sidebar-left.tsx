"use client";

import * as React from "react";
import { BotMessageSquare } from "lucide-react";

import { NavUser } from "@/components/nav/nav-user";
import { Logo } from "@/components/logo";
import { NavChats } from "@/components/nav/nav-chats";
import { NavPrompts } from "@/components/nav/nav-prompts";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/auth-context";
import { LoadingSpinner } from "../icons";

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
