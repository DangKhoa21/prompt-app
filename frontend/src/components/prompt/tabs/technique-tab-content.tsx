import { Button } from "@/components/ui/button";
import { SidebarContent } from "@/components/ui/sidebar";
import { techniques } from "@/constants/techniques";
import { usePrompt } from "@/context/prompt-context";
import { Technique } from "@/types/techniques/technique";
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
          <div>
            <h2 className="text-lg font-semibold mt-4 mb-2">
              Prompt Techniques
            </h2>
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
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-semibold mb-1">
              {selectedTechnique.name}
            </h2>
            <p className="text-sm text-muted-foreground mb-2">
              {selectedTechnique.description}
            </p>
            <div className="mb-3">
              <p className="font-semibold">Use Case:</p>
              <p className="text-sm mb-2">{selectedTechnique.useCase}</p>
            </div>
            <div className="mb-3">
              <p className="font-semibold">Prompt Template:</p>
              <pre className="bg-muted p-2 rounded text-sm whitespace-pre-wrap">
                {selectedTechnique.template}
              </pre>
            </div>
            <Button
              onClick={() => {
                setPrompt({
                  id: `technique-${selectedTechnique.id}`,
                  value: selectedTechnique.template,
                  isSending: false,
                });
                toast.success("Technique template inserted into prompt!");
              }}
            >
              Use This Template
            </Button>
          </div>
        )}
      </SidebarContent>
    </>
  );
}
