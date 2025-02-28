// create an login api call function with gracefull error handling and response

import api from "@/axios/axiosInstance";
import { AxiosError } from "axios";

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>("/login", data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error;
    } else {
      throw new Error("An error occurred. Please try again later.");
    }
  }
};
