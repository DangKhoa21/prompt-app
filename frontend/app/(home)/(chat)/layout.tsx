import { SidebarRight } from "@/components/sidebar/sidebar-right";
import { SidebarInset } from "@/components/ui/sidebar";
import { SidebarProvider2 } from "@/components/ui/sidebar2";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "New Chat",
  description: "Powerful UI for promptings",
};

export default function PromptChatLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = cookies();
  const defaultOpen = cookieStore.get("sidebar_right:state")?.value === "true";

  return (
    <SidebarProvider2 defaultOpen={defaultOpen}>
      <SidebarInset>{children}</SidebarInset>
      <SidebarRight />
    </SidebarProvider2>
  );
}
