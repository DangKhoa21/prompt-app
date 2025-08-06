import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@workspace/ui/components/sidebar";
import { Textarea } from "@workspace/ui/components/textarea";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";
import { Label } from "@radix-ui/react-label";
import { Dispatch, SetStateAction } from "react";

interface NewTabContentProps {
  idea: string;
  setIdea: Dispatch<SetStateAction<string>>;
}
export function NewTabContent({ idea, setIdea }: NewTabContentProps) {
  const { textareaRef } = useAutoResizeTextarea(idea);

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>
          <Label htmlFor="prompt-creator">Quick template creator with AI</Label>
        </SidebarGroupLabel>
        <SidebarGroupContent className="px-2">
          <p>Type in the box below what kind of template you want to create!</p>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>
          <Label htmlFor="prompt-creator">Your Idea</Label>
        </SidebarGroupLabel>
        <SidebarGroupContent className="px-3">
          <Textarea
            ref={textareaRef}
            value={idea}
            placeholder="Describe your idea for a new template... (atleast 20 characters)"
            onChange={(e) => {
              setIdea(e.target.value);
            }}
          />
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}
