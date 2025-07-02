import { useEffect, useMemo, useState } from "react";
import type { User, UserDetail } from "@/types";
import {
  useGetUserDetailByAddress,
  useUpdateUserDetailByAddress,
} from "@/api/query";
import { useAccount } from "wagmi";
import { useParams } from "react-router-dom";

export function useProfile() {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userDetail, setUserDetail] = useState<UserDetail | undefined>(undefined);
  const { id } = useParams();

  const { address } = useAccount();

  const isOwner = useMemo(() => {
    return address?.toLowerCase() === id?.toLowerCase();
  }, [address, id])

  const {
    data,
    isLoading,
    refetch,
  } = useGetUserDetailByAddress(id);
  const { mutateAsync } = useUpdateUserDetailByAddress();

  useEffect(() => {
    setUserDetail(data);
  }, [data]);

  const handleSave = (user: Partial<User>) => {
    
    mutateAsync({ address: address || "", data: {...user, wallet_address: address } })
      .then(() => {
        refetch();
      })
      .catch((err) => {
        console.error("Error updating user data:", err);
      })
      .finally(() => {
        setIsEditing(false);
      });
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return {
    id,
    isFollowing,
    isEditing,
    userDetail,
    isLoading,
    isOwner,
    setIsFollowing,
    setIsEditing,
    handleSave,
    handleCancel,
  };
}
