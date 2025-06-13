"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

import { register } from "@/services/auth";
import { registerSchema } from "@/services/auth/interface";

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
import { cn } from "@/lib/utils";

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [emailError, setEmailError] = React.useState("");
  const [usernameError, setUsernameError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setEmailError("");
    setUsernameError("");
    setPasswordError("");

    const result = registerSchema.safeParse({
      email,
      username,
      password,
    });
    if (!result.success) {
      result.error.errors.forEach((error) => {
        if (error.path.includes("email")) {
          setEmailError(error.message);
        } else if (error.path.includes("username")) {
          setUsernameError(error.message);
        } else if (error.path.includes("password")) {
          setPasswordError(error.message);
        }
      });
      setLoading(false);
      return;
    }

    try {
      const userId = await register({
        email,
        username,
        password,
      });

      if (userId) {
        toast.success("Account created successfully");
        router.push("/login");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.details) {
        if (err.details.email) {
          setEmailError(err.details.email);
        } else if (err.details.username) {
          setUsernameError(err.details.username);
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

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>
            Enter your information below to register an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
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
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                {usernameError && (
                  <p className="text-xs text-red-500">{usernameError}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                {passwordError && (
                  <p className="text-xs text-red-500">{passwordError}</p>
                )}
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Loading..." : "Register"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
