import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createNewArticle,
  getAllCategories,
  getArticleById,
  getListOfArticlesByAddress,
  getTopLikes,
  getUserDetail,
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
import type { IArticle, User, UserDetail } from "@/types";

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
