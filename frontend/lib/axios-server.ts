import axios, { AxiosRequestConfig } from "axios";

export async function safeAxiosGet(
  url: string,
  config?: AxiosRequestConfig | undefined,
) {
  try {
    const response = await axios.get(url, config);
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;
      console.error("Axios error:", status, message);
      throw new Error(`Request failed: ${message}`);
    }

    // Fallback for unexpected errors
    console.error("Unexpected error:", error);
    throw new Error("Unexpected error occurred during request");
  }
}

export async function safeAxiosGetPage(
  url: string,
  config?: AxiosRequestConfig | undefined,
) {
  try {
    const response = await axios.get(url, config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;
      console.error("Axios error:", status, message);
      throw new Error(`Request failed: ${message}`);
    }

    // Fallback for unexpected errors
    console.error("Unexpected error:", error);
    throw new Error("Unexpected error occurred during request");
  }
}
