import { useQuery } from "@tanstack/react-query";
import { SettingEditTextField } from "@/features/setting";
import { getUserProfile } from "@/services/user";
import { User } from "@/services/user/interface";
import { useState } from "react";

export function PersonalizationContent() {
  const { data: user } = useQuery({
    queryKey: ["user", "profile"],
    queryFn: getUserProfile,
  });

  const [userData, setUserData] = useState<User>(user!);

  return (
    <>
      <SettingEditTextField
        text={userData.id}
        label="id"
        setUserData={setUserData}
        editable={false}
        className="text-base"
      ></SettingEditTextField>
      <SettingEditTextField
        text={userData.username}
        label="username"
        setUserData={setUserData}
        className="text-base"
      ></SettingEditTextField>
      <SettingEditTextField
        text={userData.email}
        label="email"
        editable={false}
        setUserData={setUserData}
        className="text-base"
      ></SettingEditTextField>
    </>
  );
}
