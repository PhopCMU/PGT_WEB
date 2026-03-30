import CryptoJS from "crypto-js";
import { getToken } from "../utils/authService";
import { api } from "../lib/api";
import { encryptData } from "../utils/helpers";
import type { Get_ProjectsList_Data } from "../types/types";

export const Get_ProjectsList = async (email?: string | any) => {
  try {
    let _URL;
    const encrypted = CryptoJS.AES.encrypt(
      email,
      import.meta.env.VITE_ENCRYPTION_SECRET
    ).toString();

    if (email) {
      _URL = `/api/pgt/project/list?data=${encodeURIComponent(encrypted)}`;
    } else {
      _URL = `/api/pgt/project/list`;
    }

    const response = await api.get(_URL, {
      headers: { Authorization: `Bearer ${getToken() ?? ""}` },
    });

    return response.data;
  } catch (error) {
    console.error("Get_ProjectsList error:", error);
    return null;
  }
};

export const Get_ProjectUser = async (email: string, codeId: string) => {
  if (!email || email === "") return "Required email!";
  if (!codeId || codeId === "") return "Required codeId!";
  try {
    const data = { email, codeId };

    const encrypted = encryptData(data as Get_ProjectsList_Data);

    const response = await api.get(
      `/api/pgt/project/user?data=${encodeURIComponent(encrypted)}`,
      {
        headers: { Authorization: `Bearer ${getToken() ?? ""}` },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Get_ProjectUser error:", error);
    return null;
  }
};

export const Get_ProfiletUser = async (email: string, codeId: string) => {
  if (!email || email === "") return "Required email!";
  if (!codeId || codeId === "") return "Required codeId!";
  try {
    const data = { email, codeId };

    const encrypted = encryptData(data as Get_ProjectsList_Data);

    const response = await api.get(
      `/api/pgt/user/profile?data=${encodeURIComponent(encrypted)}`,
      {
        headers: { Authorization: `Bearer ${getToken() ?? ""}` },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Get_ProjectUser error:", error);
    return null;
  }
};
