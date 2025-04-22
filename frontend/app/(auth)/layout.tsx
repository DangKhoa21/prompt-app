import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prompt Authentication",
  description: "Powerful UI for promptings",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
