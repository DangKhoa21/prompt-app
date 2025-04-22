import { LoadingSpinner } from "@/components/icons";
import { ProtectedRoute } from "@/components/protected-route";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Prompt Template",
  description: "Powerful UI for promptings",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProtectedRoute>{children}</ProtectedRoute>
    </Suspense>
  );
}
