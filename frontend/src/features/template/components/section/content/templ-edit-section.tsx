"use client";

import ConfirmDialog from "@/components/confirm-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTemplate } from "@/context/template-context";
import {
  ConfigType,
  EditPrompt,
  EvaluatePrompt,
  handleParseTemplate,
  TemplateEditTag,
  TemplateEditTextArea,
  TemplateEditTextField,
  useUpdatePromptTemplate,
  useUpdateTag,
} from "@/features/template";
import { useIsMobile } from "@/hooks/use-mobile";
import { parseTemplateText } from "@/lib/utils/utils.generate-prompt";
import { Tag, TemplateWithConfigs } from "@/services/prompt/interface";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { appURL } from "@/config/url.config";

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
  const router = useRouter();

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

  useEffect(() => {
    const hash = window.location.hash?.replace("#", "");
    if (hash && ["edit", "evaluation"].includes(hash)) {
      setActiveTab(hash);
    }
  }, []);

  const isMobile = useIsMobile();

  const [activeTab, setActiveTab] = useState("edit");

  const handleReset = () => {
    setTemplate(savingPrompt);
  };

  const handleSave = () => {
    let errorConfigs: string[] = [];
    const MIN_ITEM = 1;

    template.configs.map((config) => {
      if (
        config.type === ConfigType.DROPDOWN ||
        config.type === ConfigType.ARRAY
      ) {
        if (config.values.length < MIN_ITEM) {
          errorConfigs = [...errorConfigs, config.label];
        }
      }
    });

    if (errorConfigs.length) {
      toast.error(
        `Config type Dropdown and Array must have at least ${MIN_ITEM} items. The following config is not valid: ${errorConfigs
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
    <>
      <div className="w-full h-full bg-background mx-auto space-y-6">
        <div className="mt-2 flex flex-col gap-4">
          <TemplateEditTextField
            label="title"
            text={template.title}
            className=""
          />

          <TemplateEditTextArea
            label="description"
            text={template.description}
            className="text-muted-foreground"
          />

          <TemplateEditTag tags={template.tags} allTags={allTags} />
        </div>

        <Tabs
          defaultValue="edit"
          value={activeTab}
          onValueChange={(val) => {
            setActiveTab(val);
            window.location.hash = val;
          }}
        >
          <TabsList className="sticky top-14 z-20 grid w-full grid-cols-2">
            <TabsTrigger value="edit">Edit Template</TabsTrigger>
            <TabsTrigger value="evaluate">Evaluate</TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="p-1 space-y-6">
            <EditPrompt />
          </TabsContent>
          <TabsContent value="evaluate" className="p-1 pb-12 space-y-6">
            <EvaluatePrompt />
          </TabsContent>
        </Tabs>
      </div>
      {activeTab === "edit" && (
        <div className="bg-background/90 sticky bottom-0 py-4 flex justify-center items-center">
          <div className="grid w-full max-w-screen-xl items-center justify-end md:grid-cols-2">
            {!isMobile && (
              <div className="flex">
                <ConfirmDialog
                  description="This will convert your variables into prompt configs. Any undeclared variables will be deleted!"
                  variant="secondary"
                  action={() => handleParseTemplate(template, setTemplate)}
                  className="mr-3"
                >
                  Parse
                </ConfirmDialog>
              </div>
            )}
            <div className="flex gap-6 justify-end">
              <Button
                variant={"outline"}
                onClick={() => {
                  router.push(`${appURL.chat}/?promptId=${template.id}`);
                }}
                className="h-8"
              >
                Use Prompt
              </Button>
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
    </>
  );
}
