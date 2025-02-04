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

// This is sample data.
const data = {
  logoInfo: {
    name: "Prompts App",
    logo: BotMessageSquare,
  },
  prompts: [
    {
      name: "Write For Me",
      url: "#",
      avatar: "/avatars/shadcn.jpg",
    },
    {
      name: "Translator",
      url: "#",
      avatar: "/avatars/shadcn.jpg",
    },
    {
      name: "Summarizer",
      url: "#",
      avatar: "/avatars/shadcn.jpg",
    },
  ],
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
      <SidebarContent>
        <NavPrompts prompts={data.prompts} />
        <NavChats isAuthenticated={isAuthenticated} />
      </SidebarContent>
      {isAuthenticated && (
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
      )}
      <SidebarRail />
    </Sidebar>
  );
}
