import { useEffect, useState } from "react";
import type { User, UserDetail } from "@/types";
import {
  useGetUserDetailByAddress,
  useUpdateUserDetailByAddress,
} from "@/api/query";
import { useAccount } from "wagmi";

export function useProfile() {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);

  const { address } = useAccount();

  const { data, refetch } = useGetUserDetailByAddress(address);
  const { mutateAsync } = useUpdateUserDetailByAddress();

  useEffect(() => {
    setUserDetail(data || null);
  }, [data]);

  const handleSave = async (user: User) => {
    mutateAsync({ address: address || "", data: user })
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
    isFollowing,
    isEditing,
    userDetail,
    setIsFollowing,
    setIsEditing,
    handleSave,
    handleCancel,
  };
}
