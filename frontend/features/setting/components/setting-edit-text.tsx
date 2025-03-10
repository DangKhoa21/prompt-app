"use client";

import { EditTextField } from "@/components/edit-text-field";
import { User } from "@/services/user/interface";
import { Dispatch, SetStateAction } from "react";

interface EditTextFieldProps {
  text: string;
  label: string;
  setUserData: Dispatch<SetStateAction<User>>;
  editable?: boolean;
  className?: string;
}

export function SettingEditTextField({
  text,
  label,
  setUserData,
  editable = true,
  className,
}: EditTextFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData((prevState) => ({
      ...prevState,
      [label]: e.target.value,
    }));
  };

  return (
    <EditTextField
      text={text}
      label={label}
      handleChange={handleChange}
      editable={editable}
      className={className}
    ></EditTextField>
  );
}
