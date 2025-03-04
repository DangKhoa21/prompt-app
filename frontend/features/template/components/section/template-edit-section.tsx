"use client";

import ConfirmDialog from "@/components/confirm-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSidebar } from "@/components/ui/sidebar";
import {
  ConfigType,
  TemplateEditTag,
  TemplateEditTextField,
  TemplatesConfigTextarea,
  TemplatesConfigVariable,
  useDeletePromptTemplate,
  useUpdatePromptTemplate,
  useUpdateTag,
} from "@/features/template";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn, generateUUID } from "@/lib/utils";
import {
  ConfigValue,
  TemplateConfig,
  TemplateWithConfigs,
} from "@/services/prompt/interface";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// TODO: Handle UI for difference errors
export function TemplateEditSection({
  initialPrompt,
}: {
  initialPrompt: TemplateWithConfigs;
}) {
  const { mutateAsync: mutateUpdateTemplate } = useUpdatePromptTemplate();
  const { mutateAsync: mutateUpdateTag } = useUpdateTag();
  const { mutateAsync: mutateDeleteTemplate } = useDeletePromptTemplate();

  const isMobile = useIsMobile();

  const handleDeleteTemplate = () => {
    const deletePromptTemplate = mutateDeleteTemplate(initialPrompt.id);

    toast.promise(deletePromptTemplate, {
      loading: "Deleting prompt template...",
      success: "Deleting prompt template successfully",
      error: (e) => {
        console.error(e);
        return "Failed to delete prompt template";
      },
    });
  };

  let savingPrompt = initialPrompt;
  const [promptData, setPromptData] =
    useState<TemplateWithConfigs>(initialPrompt);

  const { open } = useSidebar();

  const handleParseTemplate = () => {
    const promptTemplate = promptData.stringTemplate;
    const matches = Array.from(
      new Set(
        promptTemplate.match(/\$\{([^}]+)\}/g)?.map((m) => m.slice(2, -1)) ||
          [],
      ),
    );

    const createConfig = (
      id: string,
      label: string,
      type: ConfigType,
      values: ConfigValue[],
    ): TemplateConfig => ({
      id: id,
      label,
      type,
      promptId: promptData.id,
      values,
    });

    const result =
      matches.length !== 0
        ? matches.map((name) => {
            const res = promptData.configs.find((c) => c.label === name);
            return (
              res ??
              createConfig(
                generateUUID().toString(),
                name,
                ConfigType.TEXTAREA,
                [],
              )
            );
          })
        : [];

    setPromptData((prevState) => ({
      ...prevState,
      configs: result,
    }));
  };

  const handleReset = () => {
    setPromptData(savingPrompt);
  };

  const handleSave = () => {
    savingPrompt = promptData;
    const updatePromptTemplatePromise = mutateUpdateTemplate(savingPrompt);

    toast.promise(updatePromptTemplatePromise, {
      loading: "Updating prompt template...",
      success: "Updating prompt template successfully",
      error: (e) => {
        console.error(e);
        return "Failed to updating prompt template";
      },
    });

    const updateTagPromise = mutateUpdateTag({
      id: savingPrompt.id,
      data: savingPrompt.tags,
    });

    toast.promise(updateTagPromise, {
      loading: "Updating tags...",
      success: "Updating tags successfully",
      error: (e) => {
        console.error(e);
        return "Failed to updating tags";
      },
    });
  };

  return (
    <>
      <div className="flex justify-end items-center">
        <ConfirmDialog
          description=""
          variant="destructive"
          type="icon"
          className="mr-4"
          action={handleDeleteTemplate}
        >
          <Trash2 className="h-8 w-8" />
        </ConfirmDialog>
      </div>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col">
          <TemplateEditTextField
            text={promptData.title}
            label="title"
            setPromptData={setPromptData}
            className="text-2xl font-semibold"
          />

          <TemplateEditTextField
            text={promptData.description}
            label="description"
            setPromptData={setPromptData}
            className="text-muted-foreground text-lg"
          />

          <TemplateEditTag
            tags={promptData.tags}
            setPromptData={setPromptData}
          />
        </div>

        <div
          className={cn(
            "grid gap-6 h-fit lg:grid-cols-2",
            open ? "md:grid-cols-1" : "md:grid-cols-2",
          )}
        >
          <div className="space-y-4 h-fit">
            {/* <TemplatesConfigTextarea */}
            {/*   id="systemInstruction" */}
            {/*   label="System Instruction" */}
            {/*   placeholder="Enter your System Instruction ..." */}
            {/*   value={promptData.systemInstruction} */}
            {/*   setPromptData={setPromptData} */}
            {/* /> */}

            <TemplatesConfigTextarea
              id="stringTemplate"
              label="Prompt Template"
              placeholder="Enter your Prompt Template..."
              value={promptData.stringTemplate}
              setPromptData={setPromptData}
            />

            {isMobile && (
              <div className="flex justify-end">
                <ConfirmDialog
                  description="This action will make your variable into prompt configs. Variable not declared will be deleted!"
                  variant="secondary"
                  action={handleParseTemplate}
                  className="mr-3"
                >
                  Parse
                </ConfirmDialog>
              </div>
            )}
          </div>

          <div className="h-full">
            <div className="text-xl font-semibold p-2">List of Configs</div>

            <ScrollArea className="h-[576px] border rounded-md p-4 lg:ml-12">
              <div className="space-y-4">
                {promptData.configs.map((config, i) => (
                  <TemplatesConfigVariable
                    key={config.id}
                    index={i}
                    {...config}
                    setPromptData={setPromptData}
                    isSidebarOpen={open}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <div className="grid w-full items-center justify-end md:grid-cols-2">
          {!isMobile && (
            <div className="flex justify-end">
              <ConfirmDialog
                description="This action will make your variable into prompt configs. Variable not declared will be deleted!"
                variant="secondary"
                action={handleParseTemplate}
                className="mr-3"
              >
                Parse
              </ConfirmDialog>
            </div>
          )}
          <div className="flex gap-6 justify-end">
            <ConfirmDialog
              description={
                "This action can't be undone, the newst changes will be deleted!"
              }
              variant="secondary"
              action={handleReset}
              className=""
            >
              Reset
            </ConfirmDialog>

            <ConfirmDialog
              description={
                "This will save your templates, the older values will permanently be deleted!"
              }
              variant="default"
              action={handleSave}
              className={"border-primary hover:border-primary"}
            >
              Save
            </ConfirmDialog>
          </div>
        </div>
      </div>
    </>
  );
}
