import type React from "react";
import { EditTextArea } from "@/components/edit-text-area";
import { useTemplate } from "@/context/template-context";

interface TemplateEditTextAreaProps {
  text: string;
  label: string;
  className?: string;
  rows?: number;
}

export function TemplateEditTextArea({
  text,
  label,
  className,
  rows = 3,
}: TemplateEditTextAreaProps) {
  const { template, setTemplate } = useTemplate();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newTemplate = {
      ...template,
      [label]: e.target.value,
    };
    setTemplate(newTemplate);
  };

  return (
    <EditTextArea
      text={text}
      label={label}
      handleChange={handleChange}
      className={className}
      rows={rows}
    />
  );
}
