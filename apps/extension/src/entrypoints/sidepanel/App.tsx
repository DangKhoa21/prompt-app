import { PromptGeneratorSidebar } from "@/components/prompt/prompt-generator";
import AppProviders from "@/providers/app-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "sonner";

function App() {
  return (
    <AppProviders>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Toaster position="top-center" />
        <PromptGeneratorSidebar />
      </ThemeProvider>
    </AppProviders>
  );
}

export default App;
