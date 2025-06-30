import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserDetail, updateUserDetail } from "../endpoints";
import { getUserDetailKeys } from "../constant/query-keys";
import type { User, UserDetail } from "@/types";

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
