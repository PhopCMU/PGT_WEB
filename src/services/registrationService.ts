import axios, { AxiosError, type AxiosResponse } from "axios";
import { encryptData } from "../utils/helpers";
import type {
  LoginRequestData,
  RegisterRequestData,
  RegisterResponse,
} from "../types/types";
import { api } from "../lib/api";
import { removeToken } from "../utils/authService";

export const registerUser = async (data: RegisterRequestData) => {
  try {
    const encryptedData = encryptData(data as RegisterRequestData);

    const response: AxiosResponse<RegisterResponse> =
      await api.post<RegisterResponse>("/api/pgt/user/register", {
        encryptedData,
      });

    return response.data;
  } catch (error) {
    console.error("Registration error:", error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      throw new Error(
        axiosError.response?.data
          ? JSON.stringify(axiosError.response.data)
          : axiosError.message || "Network error"
      );
    }

    throw new Error("An unexpected error occurred");
  }
};

export const loginUser = async (data: LoginRequestData) => {
  try {
    const encryptedData = encryptData(data as LoginRequestData);

    const response: AxiosResponse<RegisterResponse> =
      await api.post<RegisterResponse>("/api/pgt/user/login", {
        encryptedData,
      });
    return response.data;
  } catch (error) {
    // console.error("Login error:", error);
    removeToken();
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      throw new Error(
        axiosError.response?.data
          ? JSON.stringify(axiosError.response.data)
          : axiosError.message || "Network error"
      );
    }

    throw new Error("An unexpected error occurred");
  }
};

export const resetPasswordUser = async (email: string) => {
  try {
    const encryptedData = encryptData(email);

    const response: AxiosResponse<RegisterResponse> =
      await api.post<RegisterResponse>("/api/pgt/user/reset-pass", {
        encryptedData,
      });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      throw new Error(
        axiosError.response?.data
          ? JSON.stringify(axiosError.response.data)
          : axiosError.message || "Network error"
      );
    }

    throw new Error("An unexpected error occurred");
  }
};

export const newPasswordUser = async (data: {
  id: number | null;
  email: string;
  codeId: string;
  password: string;
}) => {
  try {
    const encryptedData = encryptData(data);
    const response: AxiosResponse<RegisterResponse> =
      await api.post<RegisterResponse>("/api/pgt/user/new-pass", {
        encryptedData,
      });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      throw new Error(
        axiosError.response?.data
          ? JSON.stringify(axiosError.response.data)
          : axiosError.message || "Network error"
      );
    }

    throw new Error("An unexpected error occurred");
  }
};
