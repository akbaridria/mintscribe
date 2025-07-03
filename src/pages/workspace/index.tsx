"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DocumentSidebar } from "./components/document-sidebar";
import { EditorHeader } from "./components/editor-header";
import {
  RenderEmptyState,
  RenderLoadingState,
} from "./components/empty-and-loading-state";
import { RenderArticleContent } from "./components/article-content";
import { WorkspaceProvider } from "./workspace-provider";
import { useWorkspace } from "./use-workspace";
import EditorTitle from "./components/editor-title";
import EditorExcerpt from "./components/editor-excerpt";

const Workspace = () => {
  const {
    selectedArticle,
    contentArticle,
    isLoading,
    isPending,
    isPendingUpload,
    handleCreateNew,
    triggerFileInput,
  } = useWorkspace();

  return (
    <SidebarProvider>
      <DocumentSidebar />
      <SidebarInset>
        {selectedArticle && <EditorHeader />}
        {selectedArticle && !isLoading && !isPending && (
          <div className="space-y-4 px-8 py-4">
            <EditorTitle />
            <EditorExcerpt />
          </div>
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

const WorkspacePage = () => (
  <WorkspaceProvider>
    <Workspace />
  </WorkspaceProvider>
);

export default WorkspacePage;
