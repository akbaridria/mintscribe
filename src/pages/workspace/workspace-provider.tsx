import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { workspaceContext } from "./workspace-context";
import {
  useCreateNewArticle,
  useGetArticleById,
  useUpdateArticle,
  useUploadImage,
} from "@/api/query";
import {
  getArticleByIdKeys,
  getListOfArticlesByAddressKeys,
} from "@/api/constant/query-keys";
import type { IArticle } from "@/types";

export interface WorkspaceContextProps {
  isPublished: boolean;
  selectedArticle?: string;
  contentArticle?: IArticle;
  isLoading: boolean;
  isPending: boolean;
  isPendingUpload: boolean;
  isPendingUpdate?: boolean;
  handleCreateNew: () => Promise<void>;
  triggerFileInput: () => void;
  setIsPublished: (published: boolean) => void;
  updateArticle: (data: Partial<IArticle>) => Promise<void>;
}

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isPublished, setIsPublished] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<string | undefined>(
    id
  );
  const [contentArticle, setContentArticle] = useState<IArticle | undefined>(
    undefined
  );
  const queryClient = useQueryClient();
  const { address, isConnecting } = useAccount();

  useEffect(() => {
    if (!address && !isConnecting) {
      navigate("/", { replace: true });
    }
  }, [address, isConnecting, navigate]);

  const { mutateAsync, isPending } = useCreateNewArticle();
  const { data: articleData, isLoading } = useGetArticleById(selectedArticle);
  const { mutateAsync: uploadImageAsync, isPending: isPendingUpload } =
    useUploadImage();
  const { mutateAsync: updateArticleAsync, isPending: isPendingUpdate } =
    useUpdateArticle();

  const updateArticle = useCallback(
    async (data: Partial<IArticle>) => {
      try {
        await updateArticleAsync({ data, id: selectedArticle || "" });
        queryClient.invalidateQueries({
          queryKey: getListOfArticlesByAddressKeys(address || ""),
        });
        queryClient.invalidateQueries({
          queryKey: getArticleByIdKeys(selectedArticle || ""),
        });
      } catch {
        toast.error("Failed to update article. Please try again.");
      }
    },
    [address, queryClient, selectedArticle, updateArticleAsync]
  );

  useEffect(() => {
    if (articleData) {
      setContentArticle(articleData?.article);
      setIsPublished(articleData?.article?.is_published || false);
    }
  }, [articleData]);

  useEffect(() => {
    setSelectedArticle(id);
  }, [id]);

  const handleCreateNew = useCallback(async () => {
    try {
      const newArticle = await mutateAsync({ wallet_address: address || "" });
      setSelectedArticle(newArticle.id);
      setIsPublished(!!newArticle?.date);
      queryClient.invalidateQueries({
        queryKey: getListOfArticlesByAddressKeys(address || ""),
      });
      navigate(`/workspace/${newArticle.id}`);
    } catch {
      toast.error("Failed to create new article. Please try again.");
    }
  }, [mutateAsync, address, queryClient, navigate]);

  const triggerFileInput = () => {
    if (typeof window === "undefined") return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      let file: File | null = null;
      if ("target" in e && e.target && (e.target as HTMLInputElement).files) {
        const files = (e.target as HTMLInputElement).files;
        if (!files || files.length === 0) return;
        file = files[0];
      }
      if (!file) return;
      try {
        const result = await uploadImageAsync(file);
        if (result?.fileUrl && selectedArticle) {
          await updateArticleAsync({
            id: selectedArticle,
            data: { image: result.fileUrl },
          });
          queryClient.invalidateQueries({
            queryKey: getListOfArticlesByAddressKeys(address || ""),
          });
          queryClient.invalidateQueries({
            queryKey: getArticleByIdKeys(selectedArticle),
          });
          toast.success("Cover image updated!");
        }
      } catch {
        toast.error("Failed to upload image. Please try again.");
      }
    };
    input.click();
  };

  return (
    <workspaceContext.Provider
      value={{
        isPublished,
        selectedArticle,
        contentArticle,
        isLoading,
        isPending,
        isPendingUpload,
        isPendingUpdate,
        setIsPublished,
        handleCreateNew,
        triggerFileInput,
        updateArticle,
      }}
    >
      {children}
    </workspaceContext.Provider>
  );
};
