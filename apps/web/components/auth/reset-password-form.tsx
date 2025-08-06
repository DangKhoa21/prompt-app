"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  CircleHelp,
} from "lucide-react";

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
import { BetterTooltip } from "@workspace/ui/components/tooltip";
import { cn, getPasswordStrength } from "@/lib/utils";
import { resetPassword } from "@/services/auth";
import { resetPasswordSchema } from "@/services/auth/interface";

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

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

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      toast.error("Missing reset token");
      router.replace("/forgot-password");
    }
  }, [token, router]);

  const handleSubmit = async () => {
    setLoading(true);
    setPasswordError("");

    const result = resetPasswordSchema.safeParse({
      token,
      newPassword: password,
    });
    if (!result.success) {
      result.error.errors.forEach((error) => {
        if (error.path.includes("newPassword")) {
          setPasswordError(error.message);
        } else if (error.path.includes("token")) {
          toast.error(error.message);
          router.replace("/forgot-password");
        }
      });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setLoading(false);
      return;
    }

    try {
      await resetPassword({ token: token as string, newPassword: password });

      setIsSuccess(true);
      toast.success("Password reset successfully!");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.details?.newPassword) {
        setPasswordError(err.details.newPassword);
      } else if (err.details?.token) {
        toast.error(err.details.token);
        router.replace("/forgot-password");
      } else if (err.message) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong, please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(password);

  if (!token) {
    return null; // Will redirect
  }

  if (isSuccess) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl">
              Password Reset Successful
            </CardTitle>
            <CardDescription>
              Your password has been successfully reset. You will be redirected
              to the login page shortly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                Continue to login
              </Link>
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
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            {/* New Password */}
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">New Password</Label>
                <BetterTooltip
                  content={
                    <div>
                      <p className="text-sm">
                        A strong password should also include
                      </p>
                      <ul className="list-disc pl-4">
                        <li>At least one uppercase letter</li>
                        <li>At least one number</li>
                      </ul>
                    </div>
                  }
                >
                  <Button
                    variant="ghost"
                    className="h-8 w-8"
                    aria-label="View description"
                  >
                    <CircleHelp />
                  </Button>
                </BetterTooltip>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your new password"
                  autoFocus
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Strength</span>
                    <span
                      className={`font-medium ${
                        passwordStrength.strength >= 80
                          ? "text-green-600"
                          : passwordStrength.strength >= 60
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength.strength >= 80
                          ? "bg-green-500"
                          : passwordStrength.strength >= 60
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    />
                  </div>
                </div>
              )}

              {passwordError && (
                <p className="text-xs text-red-500">{passwordError}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Password Match Indicator */}
              {confirmPassword && (
                <div className="flex items-center gap-2 text-sm">
                  {password === confirmPassword ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-green-600">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span className="text-red-600">
                        Passwords do not match
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            <Button
              ref={buttonRef}
              type="submit"
              disabled={loading}
              onClick={handleSubmit}
              className="w-full"
            >
              {loading ? "Resetting..." : "Reset Password"}
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
