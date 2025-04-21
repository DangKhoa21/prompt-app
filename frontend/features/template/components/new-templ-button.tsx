import { Button } from "@/components/ui/button";
import { ConfigType, useCreatePromptTemplate } from "@/features/template";
import { generateUUID } from "@/lib/utils";
import {
  ConfigsCreation,
  ConfigsValueCreation,
  PromptWithConfigsCreation,
} from "@/services/prompt/interface";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useWindowSize } from "usehooks-ts";

export function AddNewTemplateButton() {
  const { mutateAsync } = useCreatePromptTemplate();
  const { width } = useWindowSize();
  const isMobile = width ? width < 768 : false;

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
      title: "Sample Template",
      description:
        "This is a sample template for you to create your own prompt template",
      stringTemplate:
        "Act as a/an ${Role}, your task is to help me in ${Detail}.",
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
      <Button className="h-10" onClick={handleNewTemplate}>
        {isMobile ? <Plus className="h-4 w-4" /> : "Add"}
      </Button>
    </>
  );
}
