"use client";

import { useState, useEffect, useCallback } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DocumentSidebar } from "./components/document-sidebar";
import { EditorHeader } from "./components/editor-header";
import {
  RenderEmptyState,
  RenderLoadingState,
} from "./components/empty-and-loading-state";
import { RenderArticleContent } from "./components/article-content";
import {
  useCreateNewArticle,
  useGetArticleById,
  useUpdateArticle,
  useUploadImage,
} from "@/api/query";
import { useAccount } from "wagmi";
import { useParams, useNavigate } from "react-router-dom";
import type { IArticle } from "@/types";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  getArticleByIdKeys,
  getListOfArticlesByAddressKeys,
} from "@/api/constant/query-keys";

const Workspace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("Untitled Article");
  const [isPublished, setIsPublished] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<string | undefined>(
    id
  );
  const [contentArticle, setContentArticle] = useState<IArticle | undefined>(
    undefined
  );
  const queryClient = useQueryClient();

  const { address } = useAccount();

  useEffect(() => {
    if (address === undefined) {
      navigate("/", { replace: true });
    }
  }, [address, navigate]);

  const { mutateAsync, isPending } = useCreateNewArticle();
  const { data: articleData, isLoading } = useGetArticleById(selectedArticle);
  const { mutateAsync: uploadImageAsync, isPending: isPendingUpload } =
    useUploadImage();
  const { mutateAsync: updateArticleAsync } = useUpdateArticle();

  useEffect(() => {
    if (articleData) {
      setContentArticle(articleData?.article);
      setTitle(articleData?.article?.title || "Untitled Article");
      setIsPublished(articleData?.article?.is_published || false);
    }
  }, [articleData]);

  useEffect(() => {
    setSelectedArticle(id);
  }, [id]);

  const handleCreateNew = useCallback(async () => {
    try {
      const newArticle = await mutateAsync({ wallet_address: address || "" });
      console.log("New article created:", newArticle);
      setSelectedArticle(newArticle.id);
      setTitle(newArticle.title || "Untitled Article");
      setIsPublished(!!newArticle?.date);
      queryClient.invalidateQueries({
        queryKey: getListOfArticlesByAddressKeys(address || ""),
      });
      navigate(`/workspace/${newArticle.id}`);
    } catch {
      toast.error("Failed to create new article. Please try again.");
    }
  }, [mutateAsync, address, queryClient, navigate]);

  const fileInputRef =
    useState<HTMLInputElement | null>(null)[0] ||
    (typeof window !== "undefined" ? document.createElement("input") : null);

  const handleCoverChange = async (
    e: React.ChangeEvent<HTMLInputElement> | Event
  ) => {
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

  const triggerFileInput = () => {
    if (!fileInputRef) return;
    fileInputRef.type = "file";
    fileInputRef.accept = "image/*";
    fileInputRef.onchange = handleCoverChange;
    fileInputRef.click();
  };

  return (
    <SidebarProvider>
      <DocumentSidebar />
      <SidebarInset>
        {selectedArticle && (
          <EditorHeader
            title={title}
            onTitleChange={setTitle}
            isPublished={isPublished}
            onPublishToggle={setIsPublished}
          />
        )}

        {!selectedArticle && !isLoading && !isPending && (
          <RenderEmptyState
            handleCreateNew={handleCreateNew}
            isPending={isPending}
          />
        )}
        {(isPending || isLoading) && <RenderLoadingState />}
        {selectedArticle && !isPending && !isLoading && (
          <RenderArticleContent
            contentArticle={contentArticle}
            triggerFileInput={triggerFileInput}
            isPendingUpload={isPendingUpload}
          />
        )}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Workspace;
