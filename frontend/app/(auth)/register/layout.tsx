import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Powerful UI for promptings",
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
