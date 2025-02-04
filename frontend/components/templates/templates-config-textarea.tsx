import { Template } from "@/app/(home)/templates/[id]/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dispatch, SetStateAction } from "react";

interface configTextareaProp {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  setPromptData: Dispatch<SetStateAction<Template>>;
}

export default function TemplatesConfigTextarea({
  id,
  label,
  placeholder,
  value,
  setPromptData,
}: configTextareaProp) {
  const handleTextareaChange = (configLabel: string, value: string) => {
    setPromptData((prevState) => ({
      ...prevState,
      [configLabel]: value,
    }));
  };

  return (
    <Card className="bg-background-primary">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder={placeholder}
          className="min-h-[200px]"
          value={value}
          onChange={(e) => {
            handleTextareaChange(id, e.target.value);
          }}
        />
      </CardContent>
    </Card>
  );
}
