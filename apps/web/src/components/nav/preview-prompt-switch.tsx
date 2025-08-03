import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";

export function PreviewPromptSwitch() {
  const [showPreviewPrompt, setShowPreviewPrompt] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setShowPreviewPrompt(localStorage.getItem("showPreviewPrompt") === "true");
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="hidden" />; // Prevents hydration mismatch

  return (
    <Switch
      id="preview-prompt-toggle"
      checked={showPreviewPrompt}
      className="ml-auto"
      onCheckedChange={(checked) => {
        setShowPreviewPrompt(checked);
        localStorage.setItem("showPreviewPrompt", String(checked));
        window.location.reload(); // temporary approach by full page reload to apply changes, use context for better approach
      }}
    />
  );
}
