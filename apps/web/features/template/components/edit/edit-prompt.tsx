import ConfirmDialog from "@/components/confirm-dialog";
import { useSidebar } from "@workspace/ui/components/sidebar";
import { useTemplate } from "@/context/template-context";
import { handleParseTemplate } from "@/features/template/components/handle-parse-template";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@workspace/ui/lib/utils";
import { TemplatesConfigTextarea } from "./templ-config-textarea";
import { TemplatesConfigVariable } from "./templ-config-value";
import { TemplateGenerator } from "./templ-generator";

export function EditPrompt() {
  const { template, setTemplate } = useTemplate();
  const { open } = useSidebar();
  const isMobile = useIsMobile();

  return (
    <>
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
            highlight
          />

          {isMobile && (
            <div className="flex my-2 justify-end">
              <ConfirmDialog
                description="This action will convert your variables into prompt configs. Any undeclared variables will be deleted!"
                variant="secondary"
                action={() => handleParseTemplate(template, setTemplate)}
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
            {template.configs.length > 0 ? (
              template.configs.map((config) => (
                <TemplatesConfigVariable
                  key={config.id}
                  {...config}
                  isSidebarOpen={open}
                />
              ))
            ) : (
              <div className="p-2">
                You have not created any config yet. Input the prompt template
                and use parse function to create!
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
