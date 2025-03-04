import { Button } from "@/components/ui/button";
import { ConfigType, useCreatePromptTemplate } from "@/features/template";
import { generateUUID } from "@/lib/utils";
import {
  ConfigsCreation,
  ConfigsValueCreation,
  PromptWithConfigsCreation,
} from "@/services/prompt/interface";
import { toast } from "sonner";

export function AddNewTemplateButton() {
  const { mutateAsync } = useCreatePromptTemplate();
  const handleNewTemplate = () => {
    const values: ConfigsValueCreation[] = [
      {
        id: generateUUID(),
        value: "Teacher",
      },
      {
        id: generateUUID(),
        value: "Assistant",
      },
    ];

    const configs: ConfigsCreation[] = [
      {
        id: generateUUID(),
        label: "Role",
        type: ConfigType.DROPDOWN,
        values: values,
      },
      {
        id: generateUUID(),
        label: "Detail",
        type: ConfigType.TEXTAREA,
        values: [],
      },
    ];

    const template: PromptWithConfigsCreation = {
      id: generateUUID(),
      title: "Template Name",
      description:
        "This template is used for writing, brainstorming new idea for your project, ... etc",
      stringTemplate:
        "You are my ${Role}, and your task is to help me in ${Field} at the level of ${Level}. More detail: ${Detail}",
      configs: configs,
    };

    const createPromptTemplatePromise = mutateAsync(template);

    toast.promise(createPromptTemplatePromise, {
      loading: "Creating prompt template...",
      success: "Creating prompt template successfully",
      error: (e) => {
        console.error(e);
        return "Failed to create new prompt template";
      },
    });
  };

  return (
    <>
      <Button size="sm" onClick={handleNewTemplate}>
        Add new
      </Button>
    </>
  );
}
