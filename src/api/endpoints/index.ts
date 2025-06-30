import type { User } from "@/types";
import { apiClient } from "../client";

const getUserDetail = async (address: string) =>
  apiClient()
    .get(`/user/${address}`)
    .then((res) => res.data);

const updateUserDetail = async (address: string, data: Partial<User>) =>
  apiClient()
    .post(`/user/${address}`, data)
    .then((res) => res.data);

export { getUserDetail, updateUserDetail };
