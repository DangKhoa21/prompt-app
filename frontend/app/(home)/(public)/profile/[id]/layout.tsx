import { DetailsHeader } from "@/components/details/details-header";
import { SERVER_URL, VERSION_PREFIX } from "@/config";
import { User } from "@/services/user/interface";
import axios from "axios";
import { ReactNode } from "react";

async function getUser(id: string): Promise<User> {
  const response = await axios.get(
    `${SERVER_URL}/${VERSION_PREFIX}/users/${id}`,
  );
  return response.data.data;
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const user = await getUser(params.id);

  return {
    title: user.username,
    description: `Profile ${user.username}`,
  };
}

export default function ProfileIdLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <DetailsHeader pageName="Profile Detail"></DetailsHeader>
      {children}
    </>
  );
}
