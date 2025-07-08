import { DetailsHeader } from "@/components/details/details-header";
import axiosInstance from "@/lib/axios/axiosIntance";
import { User } from "@/services/user/interface";
import { ReactNode } from "react";

async function getUser(id: string): Promise<User> {
  const response = await axiosInstance.get(`/users/${id}`);
  return response.data.data;
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    const user = await getUser(params.id);
    if (!user) {
      return {
        title: "User not found",
        description: "The requested user does not exist.",
      };
    }

    return {
      title: user.username,
      description: `Profile ${user.username}`,
    };
  } catch {
    return {
      title: "Error",
      description: "An error occurred while fetching the user.",
    };
  }
}

export default function ProfileIdLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <DetailsHeader pageName="Profile Detail"></DetailsHeader>
      {children}
    </>
  );
}
