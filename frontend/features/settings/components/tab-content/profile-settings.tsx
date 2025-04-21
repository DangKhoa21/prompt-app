"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AvatarUpload, SettingsEditTextField } from "@/features/settings";
import { getUserProfile } from "@/services/user";
import { useQuery } from "@tanstack/react-query";
import { useUpdateUserProfile } from "../../hooks";

export function ProfileSettings() {
  const {
    data: user,
    isError,
    isPending,
  } = useQuery({
    queryKey: ["user", "profile"],
    queryFn: getUserProfile,
  });

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
    return null;
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
          <Button variant="outline">Change Password</Button>
        </div>
      </div>
    </div>
  );
}
