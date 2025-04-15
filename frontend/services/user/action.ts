import { SERVER_URL, VERSION_PREFIX } from "@/config";
// import { safeAxiosGet } from "@/lib/axios-server";
import { User } from "@/services/user/interface";

export async function getUserServer(id: string): Promise<User> {
  const res = await fetch(`${SERVER_URL}/${VERSION_PREFIX}/users/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`Failed to fetch user ${id} data`);
  const json = await res.json();
  return json.data;
}
