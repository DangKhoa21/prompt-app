import { Template } from "@/app/(home)/templates/[id]/page";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Check, Pencil, X } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

interface EditTextFieldProps {
  text: string;
  label: string;
  setPromptData: Dispatch<SetStateAction<Template>>;
  className?: string;
}

export default function EditTextField({
  text,
  label,
  setPromptData,
  className,
}: EditTextFieldProps) {
  const [isEdit, setIsEdit] = useState(false);
  const [localText, setLocalText] = useState("");

  const handleEditField = () => {
    setPromptData((prevState) => ({
      ...prevState,
      [label]: localText,
    }));
  };

  const handleLocalEdit = (value: string) => {
    setLocalText(value);
  };

  return isEdit ? (
    <>
      <div
        className={cn(
          "flex flex-col gap-4 w-full",
          label === "name" ? "md:w-2/3 lg:w-1/3" : "md:w-4/5",
        )}
      >
        <Label
          htmlFor={`${label}-edit-field`}
          className={cn("capitalize italic", className)}
        >
          Edit {label}
        </Label>
        <Textarea
          id={`${label}-edit-field`}
          placeholder={`Enter your new ${label}`}
          value={localText}
          onChange={(e) => {
            handleLocalEdit(e.target.value);
          }}
          className="w-auto"
        />
        <div className="flex justify-end gap-4">
          <Button
            variant="destructive"
            onClick={() => {
              setIsEdit(false);
            }}
            size="icon"
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
          <Button
            variant="default"
            onClick={() => {
              setIsEdit(false);
              handleEditField();
            }}
            size="icon"
            className="h-8 w-8"
          >
            <Check className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  ) : (
    <>
      <h1 className={cn("text-2xl font-semibold", className)}>{text}</h1>
      <Button
        variant="ghost"
        onClick={() => {
          setIsEdit(true);
          setLocalText(text);
        }}
        size="icon"
        className="h-8 w-8"
      >
        <Pencil className="h-4 w-4" />
      </Button>
    </>
  );
}
