import { EditTextField } from "@/components/edit-text-field";
import { useTemplate } from "@/context/template-context";

interface EditTextFieldProps {
  text: string;
  label: string;
  className?: string;
}

export function TemplateEditTextField({
  text,
  label,
  className,
}: EditTextFieldProps) {
  const { template, setTemplate } = useTemplate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTemplate = {
      ...template,
      [label]: e.target.value,
    };

    setTemplate(newTemplate);
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
