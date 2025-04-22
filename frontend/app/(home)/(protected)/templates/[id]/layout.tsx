import { TemplateProvider } from "@/context/template-context";
import { TemplatesIdHeader } from "@/features/template";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prompt Template",
  description: "Powerful UI for promptings",
};

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const { id } = params;
  return (
    <TemplateProvider>
      <TemplatesIdHeader id={id} />
      {children}
    </TemplateProvider>
  );
}
