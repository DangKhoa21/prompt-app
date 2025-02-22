import { PromptProvider } from "@/context/prompt-context";
import { AuthProvider } from "@/context/auth-context";
import QueryProvider from "@/providers/query-provider/query-provider";
import React from "react";

interface AppProvidersProps {
  children: React.ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <AuthProvider>
        <PromptProvider>{children}</PromptProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
