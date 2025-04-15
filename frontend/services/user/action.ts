import { SERVER_URL, VERSION_PREFIX } from "@/config";
import { safeAxiosGet } from "@/lib/axios-server";
import { User } from "@/services/user/interface";

export async function getUserServer(id: string): Promise<User> {
  const res = await safeAxiosGet(`${SERVER_URL}/${VERSION_PREFIX}/users/${id}`);

  return res.data.data;
}
