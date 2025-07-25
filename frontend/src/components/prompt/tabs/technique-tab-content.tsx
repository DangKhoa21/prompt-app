import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  SidebarContent,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { appURL } from "@/config/url.config";
import { techniques } from "@/constants/techniques";
import { usePrompt } from "@/context/prompt-context";
import { Technique } from "@/types/techniques/technique";
import { ArrowLeft, LinkIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export function TechniqueTabContent() {
  const [selectedTechnique, setSelectedTechnique] = useState<Technique | null>(
    null,
  );
  const { setPrompt } = usePrompt();

  return (
    <>
      <SidebarContent className="p-4 overflow-y-auto">
        {!selectedTechnique ? (
          <>
            <SidebarGroupLabel>
              <div className="w-full flex items-center justify-between">
                <Label htmlFor="prompt-techniques">Prompt Techniques</Label>
                <Link href={appURL.techniques}>
                  <LinkIcon className="w-3.5 h-3.5" />
                </Link>
              </div>
            </SidebarGroupLabel>
            <SidebarGroupContent className="px-3">
              <div className="flex flex-col gap-2">
                {techniques.map((tech) => (
                  <Button
                    key={tech.id}
                    variant="outline"
                    className="flex justify-start gap-2"
                    onClick={() => setSelectedTechnique(tech)}
                  >
                    {tech.icon}
                    <div className="text-left truncate">
                      <p className="font-semibold">{tech.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {tech.description}
                      </p>
                    </div>
                  </Button>
                ))}
              </div>
            </SidebarGroupContent>
          </>
        ) : (
          <>
            <SidebarGroupLabel>
              <Label htmlFor="prompt-techniques" className="w-full">
                <div className="flex items-center justify-between">
                  {selectedTechnique.name}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedTechnique(null);
                    }}
                  >
                    <ArrowLeft />
                  </Button>
                </div>
              </Label>
            </SidebarGroupLabel>
            <SidebarGroupContent className="px-3">
              <p className="text-sm mb-2">{selectedTechnique.description}</p>
            </SidebarGroupContent>

            <SidebarGroupLabel>
              <Label htmlFor="prompt-techniques">Use Case:</Label>
            </SidebarGroupLabel>
            <SidebarGroupContent className="px-3">
              <p className="text-sm mb-2">{selectedTechnique.useCase}</p>
            </SidebarGroupContent>

            <SidebarGroupLabel>
              <Label htmlFor="prompt-techniques">Prompt Template:</Label>
            </SidebarGroupLabel>
            <SidebarGroupContent className="px-3">
              <pre className="bg-muted p-2 rounded text-sm whitespace-pre-wrap">
                {selectedTechnique.template}
              </pre>
              <Button
                onClick={() => {
                  setPrompt({
                    id: `technique-${selectedTechnique.id}`,
                    value: selectedTechnique.template,
                    isSending: false,
                  });
                  toast.success("Technique template inserted into prompt!");
                }}
                className="mt-2"
              >
                Use This Template
              </Button>
            </SidebarGroupContent>
          </>
        )}
      </SidebarContent>
    </>
  );
}
