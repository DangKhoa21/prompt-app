import { AuthProvider } from "@/context/auth-context";
import { PromptProvider } from "@/context/prompt-context";
import QueryProvider from "@/providers/query-provider/query-provider";

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
