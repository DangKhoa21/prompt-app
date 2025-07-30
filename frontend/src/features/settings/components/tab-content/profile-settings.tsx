"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  AvatarUpload,
  ChangePasswordDialog,
  SettingsEditTextField,
  useUpdateUserProfile,
} from "@/features/settings";
import { useUserProfile } from "@/hooks/use-user-profile";

export function ProfileSettings() {
  const { data: user, isError, isPending } = useUserProfile();

  const updateUserProfileMutation = useUpdateUserProfile();

  const setUserName = (value: string) => {
    if (user) {
      updateUserProfileMutation.mutate({
        id: user.id,
        data: { username: value },
      });
    }
  };

  const setBio = (value: string) => {
    if (user) {
      updateUserProfileMutation.mutate({
        id: user.id,
        data: { bio: value },
      });
    }
  };

  if (isPending) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-muted animate-pulse rounded" />
          <div className="h-4 w-64 bg-muted animate-pulse rounded" />
        </div>
        <Separator />
        <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
          <div className="h-20 w-20 bg-muted animate-pulse rounded-full" />
          <div className="flex-1 space-y-4">
            <div className="h-10 bg-muted animate-pulse rounded" />
            <div className="h-10 bg-muted animate-pulse rounded" />
            <div className="h-10 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center">
        Error loading user profile :(
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your profile information
        </p>
      </div>

      <Separator />

      <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
        <div className="relative">
          <AvatarUpload user={user} />
        </div>

        <div className="flex-1 space-y-4">
          <SettingsEditTextField
            value={user.username}
            setValue={setUserName}
            label="Username"
          />

          <SettingsEditTextField
            value={user.bio ?? ""}
            setValue={setBio}
            label="Bio"
          />

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="flex space-x-2">
              <Input
                id="email"
                type="email"
                value={user.email}
                autoComplete="on"
                disabled
                className="bg-muted text-muted-foreground"
              />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium">Account Security</h4>
          <p className="text-sm text-muted-foreground">
            Manage your password and account security settings
          </p>
        </div>

        <div className="space-y-2">
          <ChangePasswordDialog />
        </div>
      </div>
    </div>
  );
}
