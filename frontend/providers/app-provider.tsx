import { PromptProvider } from "@/context/prompt-context";
import QueryProvider from "@/providers/query-provider/query-provider";
import React from "react";

interface AppProvidersProps {
  children: React.ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <PromptProvider>{children}</PromptProvider>
    </QueryProvider>
  );
}
