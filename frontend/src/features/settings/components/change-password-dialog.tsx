"use client";

import type React from "react";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BetterTooltip } from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUpdateUserPassword } from "@/features/settings";
import {
  Eye,
  EyeOff,
  Lock,
  AlertCircle,
  CheckCircle,
  CircleHelp,
} from "lucide-react";
import { changePasswordSchema } from "@/services/auth/interface";
import { getPasswordStrength } from "@/lib/utils";

export function ChangePasswordDialog() {
  const [open, setOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const updatePasswordMutation = useUpdateUserPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = changePasswordSchema.safeParse({
      oldPassword,
      newPassword,
    });

    const validationErrors: string[] = [];
    if (!result.success) {
      validationErrors.push(
        ...result.error.errors.map((error) => error.message)
      );
      setErrors(validationErrors);
      return;
    }

    // validate password confirmation
    if (newPassword !== confirmPassword) {
      validationErrors.push("New passwords do not match");
    }

    // check if new password is different from old
    if (oldPassword === newPassword) {
      validationErrors.push("New password must be different from old password");
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);

    try {
      const isSuccess = await updatePasswordMutation.mutateAsync({
        oldPassword: oldPassword,
        newPassword,
      });

      // reset and close dialog on success
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setOpen(false);

      if (isSuccess) {
        toast.success("Password updated successfully!");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.details) {
        const errs = [];
        if (err.details.oldPassword) {
          errs.push(err.details.oldPassword);
        } else if (err.details.newPassword) {
          errs.push(err.details.oldPassword);
        }
        setErrors(errs);
        return;
      }

      if (err.message) {
        setErrors([err.message]);
      } else {
        setErrors(["Failed to update password. Please try again."]);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrors([]);
  };

  const passwordStrength = getPasswordStrength(newPassword);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Change Password
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Enter your old password and choose a new secure password.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Old Password */}
          <div className="space-y-2">
            <Label htmlFor="old-password">Old Password</Label>
            <div className="relative">
              <Input
                id="old-password"
                type={showOldPassword ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter your old password"
                className="pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                {showOldPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="new-password">New Password</Label>
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
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                className="pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Password Strength Indicator */}
            {newPassword && (
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
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                className="pr-10"
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
                {newPassword === confirmPassword ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-green-600">Passwords match</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="text-red-600">Passwords do not match</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Error Messages */}
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={updatePasswordMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updatePasswordMutation.isPending}
              className="min-w-[100px]"
            >
              {updatePasswordMutation.isPending
                ? "Updating..."
                : "Update Password"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
