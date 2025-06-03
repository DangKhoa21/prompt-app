import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ChangeEvent } from "react";

interface DescriptionEditorProps {
  description: string;
  isMandatory: boolean;
  onDescriptionChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onRequiredChange: () => void;
}

export function DescriptionEditor({
  description,
  isMandatory,
  onDescriptionChange,
  onRequiredChange,
}: DescriptionEditorProps) {
  return (
    <>
      <div className="flex justify-between items-center h-10">
        <div className="font-medium">Description</div>
        <div className="flex justify-between items-center gap-4">
          <p className="text-base font-semibold italic">Required</p>
          <Switch checked={isMandatory} onCheckedChange={onRequiredChange} />
        </div>
      </div>
      <Textarea
        placeholder="Adding your description"
        value={description}
        onChange={onDescriptionChange}
      />
    </>
  );
}
