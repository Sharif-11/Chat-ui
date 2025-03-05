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

export const checkLogin = async (): Promise<LoginResponse> => {
  try {
    const response = await api.get<LoginResponse>("/check-login");
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error;
    } else {
      throw new Error("An error occurred. Please try again later.");
    }
  }
};
export const createAgent = async (
  data: CreateAgentRequest
): Promise<CreateAgentResponse> => {
  try {
    const response = await api.post<CreateAgentResponse>("/agents", data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error;
    } else {
      throw new Error("An error occurred. Please try again later.");
    }
  }
};
export const getAllAgents = async (): Promise<GetAgentsResponse> => {
  try {
    const response = await api.get<GetAgentsResponse>("/agents");
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error;
    } else {
      throw new Error("An error occurred. Please try again later.");
    }
  }
};
export const logout = async (): Promise<LogoutResponse> => {
  try {
    const response = await api.post<LogoutResponse>("/logout");
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error;
    } else {
      throw new Error("An error occurred. Please try again later.");
    }
  }
};
