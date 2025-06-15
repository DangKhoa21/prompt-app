import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { LoadingSpinner } from "@/components/icons";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ResetPasswordForm className="w-full max-w-sm" />
    </Suspense>
  );
}
