import { API_BASE_URL } from "@/config";
import axios from "axios";

export const apiClient = (contentType: string = "application/json") => {
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": contentType,
    },
  });
};
