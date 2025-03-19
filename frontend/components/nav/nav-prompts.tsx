"use client";

import { Folder, Forward, MoreHorizontal, Trash2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, PencilRuler, PinOff } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavPrompts({
  prompts,
}: {
  prompts: {
    name: string;
    url: string;
    avatar: string;
  }[];
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Pinned Prompts</SidebarGroupLabel>
      <SidebarMenu>
        {pinnedPrompts.map((item) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton
              className="h-12"
              onClick={() => handlePromptChange(item.id)}
            >
              <PencilRuler className="mr-2 h-4 w-4" />
              <div>
                <div className="line-clamp-1">{item.title}</div>
                <div className="text-xs line-clamp-1">{item.description}</div>
              </div>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction
                  showOnHover
                  className="w-7 peer-data-[size=default]/menu-button:top-3"
                >
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem
                  onSelect={() => unpinPromptMutation.mutate(item.id)}
                >
                  <PinOff className="text-muted-foreground" />
                  <span>Unpin</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
