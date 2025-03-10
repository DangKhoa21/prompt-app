"use client";

import { EditTextField } from "@/components/edit-text-field";
import { TemplateWithConfigs } from "@/services/prompt/interface";
import { Dispatch, SetStateAction } from "react";

interface EditTextFieldProps {
  text: string;
  label: string;
  setPromptData: Dispatch<SetStateAction<TemplateWithConfigs>>;
  className?: string;
}

export function TemplateEditTextField({
  text,
  label,
  setPromptData,
  className,
}: EditTextFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPromptData((prevState) => ({
      ...prevState,
      [label]: e.target.value,
    }));
  };

  return (
    <EditTextField
      text={text}
      label={label}
      handleChange={handleChange}
      className={className}
    />
  );
}
