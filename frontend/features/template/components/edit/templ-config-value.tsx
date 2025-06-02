"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useTemplate } from "@/context/template-context";
import {
  AddConfigDialog,
  ConfigDnD,
  ConfigType,
  ConfigTypeSelector,
  DescriptionEditor,
} from "@/features/template";
import { cn } from "@/lib/utils";
import { parseInfo, stringifyInfo } from "@/lib/utils.details";
import { TemplateConfig } from "@/services/prompt/interface";
import { ChangeEvent, useCallback, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";

interface ConfigVariableProps extends TemplateConfig {
  isSidebarOpen?: boolean;
}

export function TemplatesConfigVariable({
  id,
  label,
  type,
  info,
  values,
  isSidebarOpen,
}: ConfigVariableProps) {
  const [isOpen, setIsOpen] = useState(false);
  const extractedInfo = parseInfo(info);
  const [isMandatory, setIsMandatory] = useState(extractedInfo.isRequired);
  const [description, setDescription] = useState(extractedInfo.description);
  const { template, setTemplate } = useTemplate();

  const updateTemplateInfo = useCallback(
    (desc: string, isReq: boolean) => {
      const newTemplate = {
        ...template,
        configs: template.configs.map((config) =>
          config.id === id
            ? {
                ...config,
                info: stringifyInfo({ isRequired: isReq, description: desc }),
              }
            : config,
        ),
      };
      setTemplate(newTemplate);
    },
    [template, id, setTemplate],
  );

  const handleRequiredChange = () => {
    const newState = !isMandatory;
    setIsMandatory(newState);
    updateTemplateInfo(description, newState);
  };

  const debouncedUpdate = useDebounceCallback((desc: string) => {
    updateTemplateInfo(desc, isMandatory);
  }, 500);

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newDesc = e.target.value;
    setDescription(newDesc);
    debouncedUpdate(newDesc);
  };

  // TODO: Smaller display on small devices (slide left to delete item instead of click)
  return (
    <Card key={id} className="border border-slate-500">
      <CardHeader
        className={cn("pt-6 pb-2 px-4", isSidebarOpen ? "md:px-6" : "lg:px-4")}
        onClick={() => setIsOpen(!isOpen)}
      >
        <CardTitle className="text-base font-semibold flex justify-between items-center">
          <div className="flex gap-2">
            {label}{" "}
            {isMandatory && <div className="text-lg text-red-400">*</div>}
          </div>

          <div className="italic text-sm font-thin cursor-default">
            {!isOpen ? "Click for details" : "Click to hide"}
          </div>

          <ConfigTypeSelector id={id} type={type} />
        </CardTitle>
      </CardHeader>
      {(isOpen || type !== ConfigType.TEXTAREA) && (
        <Separator
          orientation="horizontal"
          className="w-auto mx-6 bg-slate-500"
        ></Separator>
      )}
      <CardContent className="pb-2">
        <div className="mt-2">
          {isOpen ? (
            <div className="">
              <div className="flex flex-col gap-2">
                <DescriptionEditor
                  description={description}
                  isMandatory={isMandatory}
                  onDescriptionChange={handleDescriptionChange}
                  onRequiredChange={handleRequiredChange}
                />
                {(type === ConfigType.DROPDOWN ||
                  type === ConfigType.ARRAY ||
                  type === ConfigType.COMBOBOX) && (
                  <AddConfigDialog id={id} label={label} values={values} />
                )}
              </div>
              {type === ConfigType.TEXTAREA && (
                <div className="mt-2 text-gray-500">
                  <p>
                    Textarea type selected. You can enter multiple lines of
                    text.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {description && (
                <div className="flex gap-2 text-sm italic">
                  <div className="font-semibold">Description:</div>
                  <div className="">{description}</div>
                </div>
              )}
              {!(type === ConfigType.TEXTAREA) && (
                <ScrollArea className="h-[100px] border rounded-md p-2">
                  <ConfigDnD key={id} id={id} values={values}></ConfigDnD>
                </ScrollArea>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
