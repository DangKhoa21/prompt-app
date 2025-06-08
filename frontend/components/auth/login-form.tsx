"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { toast } from "sonner";

import { useAuth } from "@/context/auth-context";
import { login } from "@/services/auth";
import { loginSchema } from "@/services/auth/interface";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SERVER_URL, VERSION_PREFIX, WEB_URL } from "@/config";
import { cn, openCenteredPopup } from "@/lib/utils";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { setToken } = useAuth();
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);

  // Add "Enter" key to login button
  useEffect(() => {
    const handleEnterPress = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        const active = document.activeElement;
        // Optional check: if active element is not a button
        if (active && active.tagName !== "BUTTON") {
          e.preventDefault(); // prevent double form submission just in case
          buttonRef.current?.click(); // Trigger login
        }
      }
    };

    document.addEventListener("keydown", handleEnterPress);
    return () => document.removeEventListener("keydown", handleEnterPress);
  }, []);

  const emailRef = useRef<HTMLInputElement>(null);

  // Auto focus email when navigated
  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setEmailError("");
    setPasswordError("");

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      result.error.errors.forEach((error) => {
        if (error.path.includes("email")) {
          setEmailError(error.message);
        } else if (error.path.includes("password")) {
          setPasswordError(error.message);
        }
      });
      setLoading(false);
      return;
    }

    try {
      const token = await login({ email, password });

      if (token) {
        setToken(token);
        router.replace("/");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.details) {
        if (err.details.email) {
          setEmailError(err.details.email);
        } else if (err.details.password) {
          setPasswordError(err.details.password);
        }
      }
      if (err.message) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong, please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const popup = openCenteredPopup(
      `${SERVER_URL}/${VERSION_PREFIX}/auth/google?client=web`,
      "googleLoginPopup",
      500,
      600,
    );

    if (!popup) {
      toast.error("Please allow popups for this site to login with Google.");
      return;
    }

    window.addEventListener("message", (event) => {
      if (event.origin !== WEB_URL) return;

      const token = event.data?.token;
      if (token) {
        setToken(token);
        router.replace("/");
      }
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                ref={emailRef}
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {emailError && (
                <p className="text-xs text-red-500">{emailError}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {passwordError && (
                <p className="text-xs text-red-500">{passwordError}</p>
              )}
            </div>
            <Button
              ref={buttonRef}
              type="submit"
              disabled={loading}
              onClick={handleLogin}
              className="w-full"
            >
              {loading ? "Loading..." : "Login"}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
            >
              Login with Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="underline underline-offset-4">
              Register
            </Link>
          </div>
          <div className="mt-4 text-center text-sm">
            <a
              href="#"
              className="inline-block text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
