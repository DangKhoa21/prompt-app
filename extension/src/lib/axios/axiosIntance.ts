import { SERVER_URL, VERSION_PREFIX } from "@/config";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${SERVER_URL}/${VERSION_PREFIX}`,
});

export default axiosInstance;
