import api from "@/axios/axiosInstance";
import { AxiosError } from "axios";

export const getChatRequests = async () => {
  try {
    const response = await api.get("/chat-requests");
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error;
    } else {
      throw new Error("An error occurred. Please try again later.");
    }
  }
};
