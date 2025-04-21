import { TemplateProvider } from "@/context/template-context";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <TemplateProvider>{children}</TemplateProvider>;
}
