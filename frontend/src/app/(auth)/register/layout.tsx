import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Sign up for new users",
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
