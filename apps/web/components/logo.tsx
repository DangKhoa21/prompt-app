"use client";

import * as React from "react";
import Link from "next/link";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar";
import { useAuth } from "@/context/auth-context";

export function Logo({
  logoInfo,
}: {
  logoInfo: {
    name: string;
    logo: React.ElementType;
  };
}) {
  const { isAuthenticated } = useAuth();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Link href={isAuthenticated ? "/chat" : "/"} className="w-full">
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div className="h-8 w-8 flex aspect-square size-7 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
              <logoInfo.logo className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight ml-1">
              <span className="truncate font-semibold">{logoInfo.name}</span>
            </div>
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
