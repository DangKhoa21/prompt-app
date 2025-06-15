import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Your Templates",
  description: "Configuring your Template",
};

export default function TemplatesLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
