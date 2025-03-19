import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useTemplate } from "@/context/template-context";

interface configTextareaProp {
  id: string;
  label: string;
  placeholder: string;
  value: string;
}

export function TemplatesConfigTextarea({
  id,
  label,
  placeholder,
  value,
}: configTextareaProp) {
  const { template, setTemplate } = useTemplate();

  const handleTextareaChange = (texting: string) => {
    const newTemplate = {
      ...template,
      [id]: texting,
    };

    setTemplate(newTemplate);
  };

  return (
    <Card className="border border-slate-500">
      <CardHeader>
        <CardTitle className="text-xl font-medium">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder={placeholder}
          className="min-h-[200px] border border-slate-500"
          value={value}
          onChange={(e) => {
            handleTextareaChange(e.target.value);
          }}
        />
      </CardContent>
    </Card>
  );
}
