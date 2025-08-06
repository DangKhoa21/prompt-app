"use client";

import { useCallback, useLayoutEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import { EXTENSION_INSTALLED_KEY, EXTENSION_URL } from "@/config";

export default function ExtensionChecker() {
  const [showAlert, setShowAlert] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleRedirect = useCallback(
    (url: string) => {
      const decodedUrl = decodeURIComponent(url);
      router.replace(decodedUrl);
    },
    [router]
  );

  useLayoutEffect(() => {
    const redirect = searchParams.get("redirect");
    const hasExtension = localStorage.getItem(EXTENSION_INSTALLED_KEY);

    // if it's a redirect url and user hasn't yet installed extension
    if (redirect && !hasExtension) {
      setRedirectUrl(redirect);
      setShowAlert(true);
    } else if (redirect && hasExtension) {
      handleRedirect(redirect);
    }
  }, [handleRedirect, searchParams]);

  const handleInstallNow = () => {
    window.open(EXTENSION_URL, "_blank");
  };

  const handleAlreadyHave = () => {
    localStorage.setItem(EXTENSION_INSTALLED_KEY, "true");

    if (redirectUrl) {
      handleRedirect(redirectUrl);
    }
  };

  if (!showAlert) {
    return null;
  }

  return (
    <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
      <AlertDialogContent
        className="sm:max-w-md"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Extension Required</AlertDialogTitle>
          <AlertDialogDescription>
            To continue, you need our browser extension installed. Have you
            already installed our extension?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel onClick={handleInstallNow}>
            Install now
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleAlreadyHave}>
            Already have
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
