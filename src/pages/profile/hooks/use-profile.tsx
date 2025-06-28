import { useState } from "react";
import type { User } from "@/types";

export function useProfile(initialUser: User) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(initialUser);

  const handleSave = (user: User) => {
    console.log("Saving user data:", user);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(initialUser);
    setIsEditing(false);
  };

  const updateEditedUser = (field: string, value: string) => {
    setEditedUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateSocialLink = (platform: string, value: string) => {
    setEditedUser((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));
  };

  return {
    isFollowing,
    setIsFollowing,
    isEditing,
    setIsEditing,
    editedUser,
    handleSave,
    handleCancel,
    updateEditedUser,
    updateSocialLink,
  };
}
