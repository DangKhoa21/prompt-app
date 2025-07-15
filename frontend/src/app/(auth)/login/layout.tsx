import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log in",
  description: "Login for more features",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
