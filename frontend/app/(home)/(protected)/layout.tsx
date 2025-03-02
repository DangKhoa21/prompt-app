import { LoadingSpinner } from "@/components/icons";
import { ProtectedRoute } from "@/components/protected-route";
import { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProtectedRoute>{children}</ProtectedRoute>
    </Suspense>
  );
}
