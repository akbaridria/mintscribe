import type { IArticle, User } from "@/types";
import { apiClient } from "../client";

const getUserDetail = async (address: string) =>
  apiClient()
    .get(`/user/${address}`)
    .then((res) => res.data);

const updateUserDetail = async (address: string, data: Partial<User>) =>
  apiClient()
    .post(`/user/${address}`, data)
    .then((res) => res.data);

const createNewArticle = async (data: { wallet_address: string }) =>
  apiClient()
    .post("/article", data)
    .then((res) => res.data);

const getArticleById = async (id: string) =>
  apiClient()
    .get(`/article/${id}`)
    .then((res) => res.data);

const getListOfArticlesByAddress = async (address: string) =>
  apiClient()
    .get(`/article/author/${address}`)
    .then((res) => res.data);

const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return apiClient()
    .post("/file/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);
};

const updateArticle = async (id: string, data: Partial<IArticle>) =>
  apiClient()
    .put(`/article/${id}`, data)
    .then((res) => res.data);

export {
  getUserDetail,
  updateUserDetail,
  createNewArticle,
  getArticleById,
  getListOfArticlesByAddress,
  uploadImage,
  updateArticle,
};
