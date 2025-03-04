import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function GeneralContent() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevents hydration mismatch

  return (
    <>
      <div className="flex flex-col items-start w-full space-x-2">
        <div className="flex m-2 w-full justify-between items-center">
          <Label htmlFor="dark-mode-toggle" className="text-base">
            Dark mode:
          </Label>
          <Switch
            id="dark-mode-toggle"
            checked={resolvedTheme === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          />
        </div>
      </div>
    </>
  );
}
