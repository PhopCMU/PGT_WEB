import { encryptData } from "../utils/helpers";
import { api } from "../lib/api";

import { getToken } from "../utils/authService";
import type { UserDataScanQrCode } from "../types/types";

export const Post_Register = async (data: FormData) => {
  try {
    const obj: Record<string, any> = {};

    // 1) ดึงไฟล์แนบจาก FormData (สมมติ key = "file")
    const file = data.get("slipPayment") as File | null;

    // 2) รวมข้อมูลอื่น ๆ เป็น object (ยกเว้นไฟล์)
    for (const [key, value] of data.entries()) {
      if (value instanceof File) continue;
      obj[key] = value;
    }

    const jsonFile = JSON.stringify(obj);

    const encrypted = encryptData(jsonFile);

    const response = await api.post(
      "/api/pgt/project/register",
      { encryptedData: encrypted, file: file },
      {
        headers: {
          Authorization: `Bearer ${getToken() ?? ""}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Post_Register error:", error);
    return null;
  }
};

export const Post_checkin = async (userData: UserDataScanQrCode) => {
  try {
    const encrypted = encryptData(userData);
    const response = await api.post(
      "/api/pgt/data/check-in",
      { encryptedData: encrypted },
      {
        headers: { Authorization: `Bearer ${getToken() ?? ""}` },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Post_checkin error:", error);
  }
};
