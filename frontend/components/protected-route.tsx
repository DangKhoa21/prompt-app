"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const path = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    } else {
      router.replace(`${path}?${searchParams.toString()}`);
    }
  }, [isAuthenticated, path, router, searchParams]);

  return <>{children}</>;
};
