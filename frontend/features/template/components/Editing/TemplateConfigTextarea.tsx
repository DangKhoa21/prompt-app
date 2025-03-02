"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { TemplateWithConfigs } from "@/services/prompt/interface";
import { Dispatch, SetStateAction } from "react";

interface configTextareaProp {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  setPromptData: Dispatch<SetStateAction<TemplateWithConfigs>>;
}

export function TemplatesConfigTextarea({
  id,
  label,
  placeholder,
  value,
  setPromptData,
}: configTextareaProp) {
  const handleTextareaChange = (textLabel: string, value: string) => {
    setPromptData((prevState) => ({
      ...prevState,
      [textLabel]: value,
    }));
  };

  return (
    <Card className="bg-background-primary border border-slate-500">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder={placeholder}
          className="min-h-[200px] border border-slate-500"
          value={value}
          onChange={(e) => {
            handleTextareaChange(id, e.target.value);
          }}
        />
      </CardContent>
    </Card>
  );
}
