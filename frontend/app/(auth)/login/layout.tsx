import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log in",
  description: "Powerful UI for promptings",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
