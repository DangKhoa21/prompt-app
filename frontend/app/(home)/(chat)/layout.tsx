"use client";

import { ChatProvider } from "@/app/context/ChatContext";
import { SidebarRight } from "@/components/sidebar-right";
import { SidebarInset } from "@/components/ui/sidebar";
import { SidebarProvider2 } from "@/components/ui/sidebar2";
import { SERVER_URL } from "@/config";
import { generateUUID } from "@/lib/utils";
// import { loadSavedModelId } from "@/app/(home)/(chat)/action";

export default function Layout({ children }: { children: React.ReactNode }) {
  const chatId = generateUUID();

  // let selectedModelId = ""
  // loadSavedModelId().then((returnModelId) => {
  //   selectedModelId = returnModelId
  // });
  // const initialMessages = [
  //   { role: "assistant", content: "Welcome to the chat!" },
  //   { role: "user", content: "Hi there!" },
  // ];
  const api = `${SERVER_URL}/api/v1/chat`; // Replace with your API endpoint

  return (
    <SidebarProvider2>
      <ChatProvider
        chatId={chatId}
        initialMessages={undefined}
        api={api}
        selectedModelId={undefined}
      >
        <SidebarInset>{children}</SidebarInset>
        <SidebarRight />
      </ChatProvider>
    </SidebarProvider2>
  );
}
