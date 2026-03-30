import CryptoJS from "crypto-js";
import { getToken } from "../utils/authService";
import { api } from "../lib/api";
import { encryptData } from "../utils/helpers";
import type { User } from "../types/types";

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

export const Edit_ProjectUser = async (payload: User) => {
  console.log(payload);
  if (!payload) return "Required payload!";
  if (!payload.id) return "Required payload.id!";
  if (!payload.codeId) return "Required payload.codeId!";

  try {
    const encrypted = encryptData(payload);
    const response = await api.put(
      `/api/pgt/user/profile/edit?data=${encodeURIComponent(encrypted)}`,
      payload,
      {
        headers: { Authorization: `Bearer ${getToken() ?? ""}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Edit_ProjectUser error:", error);
    return null;
  }
};
