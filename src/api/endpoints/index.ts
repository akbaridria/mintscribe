import type { IArticle, User } from "@/types";
import { apiClient } from "../client";
import { getCoin } from "@zoralabs/coins-sdk";
import { base } from "viem/chains";

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

const getTopLikes = async () =>
  apiClient()
    .get("/article/top/likes")
    .then((res) => res.data);

const getAllCategories = async () =>
  apiClient()
    .get("/article/categories/count")
    .then((res) => res.data);

const getListArticles = async (
  cursor?: string,
  category?: string,
  search?: string
) =>
  apiClient()
    .get(
      `/article/list?limit=5&cursor=${cursor || ""}&category=${
        category || ""
      }&search=${search || ""}`
    )
    .then((res) => res.data);

const getCoinDetail = async (address: string) => {
  const data = await getCoin({
    address: address,
    chain: base.id,
  });
  return data.data?.zora20Token;
};

const getAllLikesFromArticle = (id: string) =>
  apiClient()
    .get(`/article/${id}/likes/count`)
    .then((res) => res.data);

const insertLikes = (id: string, wallet_address: string) =>
  apiClient()
    .post(`/article/${id}/likes`, { wallet_address })
    .then((res) => res.data);

const removeLikes = (id: string, wallet_address: string) =>
  apiClient()
    .delete(`/article/${id}/likes`, { data: { wallet_address } })
    .then((res) => res.data);

const getIsUserLikes = (id: string, wallet_address: string) =>
  apiClient()
    .get(`/article/${id}/likes/user/${wallet_address}`)
    .then((res) => res.data);

const getAllCommentsFromArticle = (id: string) =>
  apiClient()
    .get(`/comment/${id}`)
    .then((res) => res.data);

const publishComment = (data: {
  article_id: string;
  author_wallet_address: string;
  content: string;
}) =>
  apiClient()
    .post("/comment", data)
    .then((res) => res.data);

export {
  getUserDetail,
  updateUserDetail,
  createNewArticle,
  getArticleById,
  getListOfArticlesByAddress,
  uploadImage,
  updateArticle,
  getTopLikes,
  getAllCategories,
  getListArticles,
  getCoinDetail,
  getAllLikesFromArticle,
  insertLikes,
  removeLikes,
  getIsUserLikes,
  getAllCommentsFromArticle,
  publishComment,
};
