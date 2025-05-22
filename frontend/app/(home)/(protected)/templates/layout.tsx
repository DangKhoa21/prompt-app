import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prompt Template",
  description: "Powerful UI for promptings",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
