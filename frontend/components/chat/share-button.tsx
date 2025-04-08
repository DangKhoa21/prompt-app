"use client";

import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ShareButton() {
  const handleShare = () => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams();

    params.set("promptId", promptId || "");

    data.configs.forEach((config) => {
      const key = config.label;

      if (config.type === "dropdown" || config.type === "combobox") {
        if (selectedValues[key]) {
          params.set(key, selectedValues[key]);
        }
      } else if (config.type === "textarea") {
        if (textareaValues[key]) {
          params.set(key, textareaValues[key]);
        }
      } else if (config.type === "array") {
        const arrayData = arrayValues[key];
        if (arrayData) {
          params.set(key, JSON.stringify(arrayData));
        }
      }
    });

    url.search = params.toString();
    navigator.clipboard.writeText(url.toString());
    alert("Shareable URL copied to clipboard!");
  };

  return (
    <>
      <Button onClick={generatePrompt} className="flex-1">
        Generate
      </Button>
      <Button variant="outline" onClick={sharePrompt}>
        <Share2 className="h-4 w-4" />
      </Button>
    </>
  );
}
