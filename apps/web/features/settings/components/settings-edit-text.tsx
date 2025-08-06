import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Check, Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function SettingsEditTextField({
  value,
  setValue,
  label,
}: {
  value: string;
  setValue: (value: string) => void;
  label: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleEditName = () => {
    setIsEditing(true);
    setTempValue(value);
  };

  const handleSaveName = () => {
    if (tempValue.trim() !== value) {
      setTempValue(tempValue.trim());
      setValue(tempValue.trim());
    }
    setIsEditing(false);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={label.toLowerCase()}>{label}</Label>
      <div className="flex space-x-2">
        <Input
          id={label.toLowerCase()}
          ref={inputRef}
          value={isEditing ? tempValue : value}
          onChange={(e) => setTempValue(e.target.value)}
          readOnly={!isEditing}
          autoComplete="on"
          className={
            isEditing
              ? "border-primary"
              : "bg-muted cursor-default focus-visible:ring-0 focus-visible:ring-offset-0"
          }
        />
        {isEditing ? (
          <Button
            size="icon"
            variant="outline"
            className="shrink-0"
            onClick={() => handleSaveName()}
          >
            <Check className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            size="icon"
            variant="outline"
            className="shrink-0"
            onClick={() => handleEditName()}
          >
            <Pencil className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
