"use client";

import ConfirmDialog from "@/components/confirm-dialog";
import { useSidebar } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTemplate } from "@/context/template-context";
import {
  ConfigType,
  EvaluatePrompt,
  TemplateEditTag,
  TemplateEditTextField,
  TemplateGenerator,
  TemplatesConfigTextarea,
  TemplatesConfigVariable,
  useUpdatePromptTemplate,
  useUpdateTag,
} from "@/features/template";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn, generateUUID } from "@/lib/utils";
import { parseTemplateText } from "@/lib/utils/utils.generate-prompt";
import {
  ConfigValue,
  Tag,
  TemplateConfig,
  TemplateWithConfigs,
} from "@/services/prompt/interface";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// TODO: Handle UI for difference errors
export function TemplateEditSection({
  initialPrompt,
  allTags,
}: {
  initialPrompt: TemplateWithConfigs;
  allTags: Tag[];
}) {
  const { mutateAsync: mutateUpdateTemplate } = useUpdatePromptTemplate();
  const { mutateAsync: mutateUpdateTag } = useUpdateTag();

  let savingPrompt = initialPrompt;

  const { template, setTemplate } = useTemplate();

  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      const newTemplate = {
        ...initialPrompt,
        stringTemplate: parseTemplateText(initialPrompt.stringTemplate),
      };
      setTemplate(newTemplate); // set the template only once
      hasMounted.current = true;
    }
  }, [initialPrompt, setTemplate]);

  const { open } = useSidebar();

  const isMobile = useIsMobile();

  const [activeTab, setActiveTab] = useState("edit");

  const handleParseTemplate = () => {
    const promptTemplate = template.stringTemplate;
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
      id,
      label,
      type,
      promptId: template.id,
      values,
    });

    const result =
      matches.length !== 0
        ? matches.map((name) => {
            const res = template.configs.find((c) => c.label === name);
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

    const newTemplate = {
      ...template,
      configs: result,
    };

    setTemplate(newTemplate);
  };

  const handleReset = () => {
    setTemplate(savingPrompt);
  };

  const handleSave = () => {
    let errorConfigs: string[] = [];

    template.configs.map((config) => {
      if (
        config.type === ConfigType.DROPDOWN ||
        config.type === ConfigType.ARRAY
      ) {
        if (config.values.length < 2) {
          errorConfigs = [...errorConfigs, config.label];
        }
      }
    });

    if (errorConfigs.length) {
      toast.error(
        `Config type Dropdown and Array must have at least 2 items. The following config is not valid: ${errorConfigs
          .map((config) => config)
          .join(", ")}`,
      );
      return;
    }

    savingPrompt = template;
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
    <div className="w-full bg-background/90 p-2">
      <div className="w-full bg-background mx-auto space-y-6">
        <div className="flex flex-col gap-4">
          <TemplateEditTextField
            label="title"
            text={template.title}
            className=""
          />

          <TemplateEditTextField
            label="description"
            text={template.description}
            className="text-muted-foreground"
          />

          <TemplateEditTag tags={template.tags} allTags={allTags} />
        </div>

        <Tabs
          defaultValue="edit"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="sticky top-14 z-20 grid w-full grid-cols-2">
            <TabsTrigger value="edit">Edit Template</TabsTrigger>
            <TabsTrigger value="evaluate">Evaluate</TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="p-1 space-y-6">
            <div
              className={cn(
                "bg-background py-2 grid gap-6 h-fit lg:grid-cols-2",
                open ? "md:grid-cols-1" : "md:grid-cols-2",
              )}
            >
              <div
                className={cn(
                  "lg:sticky lg:top-28 h-fit",
                  open ? "" : "sm:sticky sm:top-28",
                )}
              >
                <TemplatesConfigTextarea
                  id="systemInstruction"
                  label="System Instruction"
                  placeholder="Enter your System Instruction ..."
                  value={template.systemInstruction ?? ""}
                />

                <TemplatesConfigTextarea
                  id="stringTemplate"
                  label="Prompt Template"
                  placeholder="Enter your Prompt Template..."
                  value={template.stringTemplate}
                />

                {isMobile && (
                  <div className="flex my-2 justify-end">
                    <ConfirmDialog
                      description="This action will convert your variables into prompt configs. Any undeclared variables will be deleted!"
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
                <div className="flex justify-between items-center">
                  <div className="text-xl font-semibold p-2">Configs</div>

                  <TemplateGenerator />
                </div>

                <div className="space-y-4 h-fit border rounded-md p-4">
                  {template.configs.map((config) => (
                    <TemplatesConfigVariable
                      key={config.id}
                      {...config}
                      isSidebarOpen={open}
                    />
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="evaluate" className="p-1 pb-12 space-y-6">
            <EvaluatePrompt></EvaluatePrompt>
          </TabsContent>
        </Tabs>
      </div>
      {activeTab === "edit" && (
        <div className="bg-background/90 sticky bottom-0 py-2 flex justify-center items-center">
          <div className="grid w-full max-w-screen-xl items-center justify-end md:grid-cols-2">
            {!isMobile && (
              <div className="flex">
                <ConfirmDialog
                  description="This will convert your variables into prompt configs. Any undeclared variables will be deleted!"
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
                description="This action can't be undone. Newest changes will be deleted!"
                variant="secondary"
                action={handleReset}
                className=""
              >
                Reset
              </ConfirmDialog>

              <ConfirmDialog
                description="This will save your template. Older configurations will be deleted permanently!"
                variant="default"
                action={handleSave}
                className={"border-primary hover:border-primary"}
              >
                Save
              </ConfirmDialog>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
