import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prompt Authentication",
  description: "Powerful UI for promptings",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center p-1">
      {children}
    </main>
  );
}
