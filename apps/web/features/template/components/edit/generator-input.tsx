import { Textarea } from "@workspace/ui/components/textarea";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

export function GeneratorInput({
  input,
  setInput,
  isLoading,
  submit,
  placeholder,
}: {
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  isLoading: boolean;
  submit: (input: unknown) => void;
  placeholder?: string;
}) {
  return (
    <Textarea
      placeholder={placeholder || "Enter what you want here..."}
      value={input}
      onChange={(e) => setInput(e.target.value)}
      className="min-h-[200px] max-h-[calc(75dvh)] overflow-auto resize-none rounded-xl !text-base bg-muted"
      rows={3}
      autoFocus
      onKeyDown={(event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();

          if (isLoading) {
            toast.error("Please wait for the AI to finish its generating!");
          } else {
            submit({ prompt: input });
          }
        }
      }}
    />
  );
}
