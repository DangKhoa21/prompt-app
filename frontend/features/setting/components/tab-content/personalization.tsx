import { useQuery } from "@tanstack/react-query";
import { SettingEditTextField } from "@/features/setting";
import { getUserProfile } from "@/services/user";
import { User } from "@/services/user/interface";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface PersonalizationContentProps {
  setUserData: Dispatch<SetStateAction<User | null>>;
}

export function PersonalizationContent({
  setUserData,
}: PersonalizationContentProps) {
  const { data: user } = useQuery({
    queryKey: ["user", "profile"],
    queryFn: getUserProfile,
  });

  const [userData, setLocalUserData] = useState<User>(user!);

  useEffect(() => {
    setUserData(userData);
  }, [userData, setUserData]);

  return (
    <>
      <SettingEditTextField
        text={userData.id}
        label="id"
        setUserData={setLocalUserData}
        editable={false}
        className="text-base"
      ></SettingEditTextField>
      <SettingEditTextField
        text={userData.username}
        label="username"
        setUserData={setLocalUserData}
        className="text-base"
      ></SettingEditTextField>
      <SettingEditTextField
        text={userData.email}
        label="email"
        editable={false}
        setUserData={setLocalUserData}
        className="text-base"
      ></SettingEditTextField>
    </>
  );
}
