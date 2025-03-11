"use client";

import * as React from "react";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type ComboboxOption = {
  value: string;
};

interface CreatableComboboxProps {
  options: ComboboxOption[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onCreateOption?: (value: string) => void;
  className?: string;
}

export function CreatableCombobox({
  options,
  placeholder = "Select an option...",
  value,
  onChange,
  onCreateOption,
  className,
}: CreatableComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [selectedValue, setSelectedValue] = React.useState<string | undefined>(
    value
  );

  // update internal state when external value changes
  React.useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const filteredOptions = React.useMemo(() => {
    const updatedOptions = [{ value: "None" }, ...options];

    if (!inputValue) return updatedOptions;

    return updatedOptions.filter((option) =>
      option.value.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [options, inputValue]);

  // check if the current input value exists as an option (exact match)
  const optionExists = React.useMemo(() => {
    const updatedOptions = [{ value: "None" }, ...options];

    return updatedOptions.some(
      (option) => option.value.toLowerCase() === inputValue.toLowerCase()
    );
  }, [options, inputValue]);

  const shouldShowCreateOption = React.useMemo(() => {
    return inputValue.trim() !== "" && !optionExists;
  }, [inputValue, optionExists]);

  const handleSelect = (currentValue: string) => {
    setSelectedValue(currentValue);
    setInputValue("");
    onChange?.(currentValue);
    setOpen(false);
  };

  const handleCreate = () => {
    if (!inputValue) return;

    onCreateOption?.(inputValue);
    setInputValue("");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {selectedValue ? selectedValue : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search..."
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={handleSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValue === option.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {option.value}
                </CommandItem>
              ))}
              {shouldShowCreateOption && (
                <CommandItem onSelect={handleCreate}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create &quot;{inputValue}&quot;
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
