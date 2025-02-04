import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface configTextareaProp {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  handleTextareaChange: (id: string, value: string) => void;
}

export default function TemplatesConfigTextarea({
  id,
  label,
  placeholder,
  value,
  handleTextareaChange,
}: configTextareaProp) {
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
