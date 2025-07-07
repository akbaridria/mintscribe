import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createNewArticle,
  getAllCategories,
  getAllCommentsFromArticle,
  getAllLikesFromArticle,
  getArticleById,
  getCoinDetail,
  getIsUserLikes,
  getListOfArticlesByAddress,
  getTopLikes,
  getUserDetail,
  insertLikes,
  publishComment,
  removeLikes,
  updateArticle,
  updateUserDetail,
  uploadImage,
} from "../endpoints";
import {
  getAllCategoriesKeys,
  getArticleByIdKeys,
  getListOfArticlesByAddressKeys,
  getTopLikesKeys,
  getUserDetailKeys,
} from "../constant/query-keys";
import type { Comment, IArticle, User, UserDetail } from "@/types";

export const useGetUserDetailByAddress = (address?: string) =>
  useQuery<UserDetail, Error>({
    queryKey: getUserDetailKeys(address || ""),
    queryFn: () => getUserDetail(address || ""),
    enabled: !!address,
  });

export const useUpdateUserDetailByAddress = () =>
  useMutation<UserDetail, Error, { address: string; data: Partial<User> }>({
    mutationKey: [],
    mutationFn: ({ address, data }) => updateUserDetail(address, data),
  });

export const useCreateNewArticle = () =>
  useMutation<IArticle, Error, { wallet_address: string }>({
    mutationKey: [],
    mutationFn: (data) => createNewArticle(data),
  });

export const useGetArticleById = (id?: string) =>
  useQuery<{ article: IArticle; author: User }, Error>({
    queryKey: getArticleByIdKeys(id || ""),
    queryFn: () => getArticleById(id || ""),
    enabled: !!id,
  });

export const useGetListOfArticlesByAddress = (address?: string) =>
  useQuery<{ article: IArticle; author: User }[], Error>({
    queryKey: getListOfArticlesByAddressKeys(address || ""),
    queryFn: () => getListOfArticlesByAddress(address || ""),
    enabled: !!address,
  });

export const useUploadImage = () =>
  useMutation<{ success: boolean; fileUrl: string }, Error, File>({
    mutationKey: [],
    mutationFn: (file) => uploadImage(file),
  });

export const useUpdateArticle = () =>
  useMutation<IArticle, Error, { id: string; data: Partial<IArticle> }>({
    mutationKey: [],
    mutationFn: ({ id, data }) => updateArticle(id, data),
  });

export const useGetTopLikes = () =>
  useQuery<{ article: IArticle; user: User }[], Error>({
    queryKey: getTopLikesKeys(),
    queryFn: () => getTopLikes(),
  });

export const useGetAllCategories = () =>
  useQuery<{ category: string; count: number }[], Error>({
    queryKey: getAllCategoriesKeys(),
    queryFn: () => getAllCategories(),
  });

export const useGetCoinDetail = (address?: string) =>
  useQuery({
    queryKey: ["coinDetail", address],
    queryFn: () => {
      if (!address) return Promise.resolve(null);
      return getCoinDetail(address);
    },
    enabled: !!address,
  });

export const useGetAllLikesFromArticle = (id?: string) =>
  useQuery<{ totalLikes: number }, Error>({
    queryKey: ["likes", id],
    queryFn: () => getAllLikesFromArticle(id || ""),
    enabled: !!id,
  });

export const useAddLikes = () =>
  useMutation<
    { success: boolean },
    Error,
    { id: string; wallet_address?: string }
  >({
    mutationKey: [],
    mutationFn: ({ id, wallet_address }) =>
      insertLikes(id, wallet_address || ""),
  });

export const useRemoveLikes = () =>
  useMutation<
    { success: boolean },
    Error,
    { id: string; wallet_address?: string }
  >({
    mutationKey: [],
    mutationFn: ({ id, wallet_address }) =>
      removeLikes(id, wallet_address || ""),
  });

export const useGetIsUserLikes = (id: string, wallet_address: string) =>
  useQuery<{ isLiked: boolean }, Error>({
    queryKey: ["user-likes", wallet_address, id],
    queryFn: () => getIsUserLikes(id, wallet_address),
    enabled: !!id && !!wallet_address,
  });

export const useGetCommentFromArticle = (id: string) =>
  useQuery<Comment[], Error>({
    queryKey: ["comment", id],
    queryFn: () => getAllCommentsFromArticle(id),
    enabled: !!id,
  });

export const usePublishComment = () =>
  useMutation<
    { success: boolean },
    Error,
    { id: string; wallet_address: string; content: string }
  >({
    mutationKey: [],
    mutationFn: ({ id, content, wallet_address }) =>
      publishComment({
        article_id: id,
        author_wallet_address: wallet_address,
        content: content,
      }),
  });
