import { SidebarRight } from "@/components/sidebar/sidebar-right";
import { SidebarInset } from "@/components/ui/sidebar";
import { SidebarProvider2 } from "@/components/ui/sidebar2";
import { appURL } from "@/config/url.config";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { ReactNode } from "react";

export const metadata: Metadata = {
  alternates: {
    canonical: appURL.chat,
  },

  title: "New Chat",
  description:
    "Start a new AI conversation and craft powerful prompts effortlessly with Prompt Crafter.",
};

export default function PromptChatLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = cookies();
  const lastState = cookieStore.get("sidebar_right:state")?.value;
  const defaultOpen = lastState ? lastState === "true" : true;

  return (
    <SidebarProvider2 defaultOpen={defaultOpen}>
      <SidebarInset>{children}</SidebarInset>
      <SidebarRight />
    </SidebarProvider2>
  );
}
