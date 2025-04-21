import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function DarkModeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="hidden" />; // Prevents hydration mismatch

  return (
    <Switch
      id="dark-mode-toggle"
      checked={resolvedTheme === "dark"}
      className="ml-auto"
      onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
    />
  );
}
