import axios from "axios";
import { setupAxiosLoading } from "./axiosLoading";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
});

setupAxiosLoading(api);
