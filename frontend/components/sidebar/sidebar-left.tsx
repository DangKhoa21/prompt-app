"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  Settings2,
  SquareTerminal,
  BotMessageSquare,
} from "lucide-react";

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
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  logoInfo: {
    name: "Prompts App",
    logo: BotMessageSquare,
  },
  chats: [
    {
      name: "Japan traveling tips blog",
      url: "#",
    },
    {
      name: "Build a React app",
      url: "#",
    },
    {
      name: "Sidebar creation with shadcn/ui",
      url: "#",
    },
    {
      name: "Chemistry equation problems",
      url: "#",
    },
  ],
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
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
