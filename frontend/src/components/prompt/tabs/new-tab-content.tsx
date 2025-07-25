import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import { useAutoResizeTextarea } from "@/components/use-auto-resize-textarea";
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
          <Label htmlFor="prompt-creator">Create new prompt with AI</Label>
        </SidebarGroupLabel>
        <SidebarGroupContent className="px-3">
          <p>With the help of AI, create your desire prompt for your goal!</p>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>
          <Label htmlFor="prompt-creator">Input your desire goal</Label>
        </SidebarGroupLabel>
        <SidebarGroupContent className="px-3">
          <Textarea
            ref={textareaRef}
            value={idea}
            onChange={(e) => {
              setIdea(e.target.value);
            }}
          />
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}
