"use client";

import { SidebarRight } from "@/components/sidebar-right";
import { SidebarInset } from "@/components/ui/sidebar";
import { SidebarProvider2 } from "@/components/ui/sidebar2";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider2>
      <SidebarInset>{children}</SidebarInset>
      <SidebarRight />
    </SidebarProvider2>
  );
}
