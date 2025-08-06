"use client";

import Link from "next/link";
//import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { toast } from "sonner";
import { ArrowLeft, Mail } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { cn } from "@workspace/ui/lib/utils";
import { forgotPassword } from "@/services/auth";
import { forgotPasswordSchema } from "@/services/auth/interface";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  // const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);

  // Add "Enter" key to submit button
  useEffect(() => {
    const handleEnterPress = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        const active = document.activeElement;
        if (active && active.tagName !== "BUTTON") {
          e.preventDefault();
          buttonRef.current?.click();
        }
      }
    };

    document.addEventListener("keydown", handleEnterPress);
    return () => document.removeEventListener("keydown", handleEnterPress);
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    setEmailError("");

    const result = forgotPasswordSchema.safeParse({ email });
    if (!result.success) {
      result.error.errors.forEach((error) => {
        if (error.path.includes("email")) {
          setEmailError(error.message);
        }
      });
      setLoading(false);
      return;
    }

    try {
      const result = await forgotPassword({ email });

      if (result) {
        setIsSubmitted(true);
        setEmail("");
        toast.success("Password reset link sent to your email!");
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.details?.email) {
        setEmailError(err.details.email);
      } else if (err.message) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong, please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Check your email</CardTitle>
            <CardDescription>
              We&apos;ve sent a password reset link to <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground text-center">
                Didn&apos;t receive the email? Check your spam folder or try
                again.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail("");
                }}
                className="w-full"
              >
                Try again
              </Button>
              <div className="text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to login
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email address and we&apos;ll send you a link to reset
            your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                required
              />
              {emailError && (
                <p className="text-xs text-red-500">{emailError}</p>
              )}
            </div>

            <Button
              ref={buttonRef}
              type="submit"
              disabled={loading}
              onClick={handleSubmit}
              className="w-full"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
