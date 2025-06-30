"use client";

import { useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DocumentSidebar } from "./components/document-sidebar";
import { EditorHeader } from "./components/editor-header";
import { Camera, FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { Skeleton } from "@/components/ui/skeleton";

const Workspace = () => {
  const [title, setTitle] = useState("Untitled Article");
  const [isPublished, setIsPublished] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate article selection
  const handleArticleSelect = (articleId: string) => {
    setIsLoading(true);
    setSelectedArticle(articleId);

    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false);
      setTitle(`Article ${articleId}`);
    }, 1500);
  };

  // Simulate creating new article
  const handleCreateNew = () => {
    setIsLoading(true);
    const newId = Date.now().toString();
    setSelectedArticle(newId);

    setTimeout(() => {
      setIsLoading(false);
      setTitle("Untitled Article");
      setIsPublished(false);
    }, 1000);
  };

  const renderEmptyState = () => (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md">
        <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center">
          <FileText className="h-12 w-12 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            No article selected
          </h2>
          <p className="text-muted-foreground">
            Choose an existing article from the sidebar or create a new one to
            get started.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={handleCreateNew} className="gap-2">
            <Plus className="h-4 w-4" />
            Create New Article
          </Button>
          <Button
            variant="outline"
            onClick={() => handleArticleSelect("demo")}
            className="gap-2"
          >
            <FileText className="h-4 w-4" />
            Open Demo Article
          </Button>
        </div>
      </div>
    </div>
  );

  const renderLoadingState = () => (
    <div className="flex-1 overflow-auto">
      <div className="space-y-4">
        {/* Loading header */}
        <div className="px-8 py-4 border-b">
          <Skeleton className="h-8 w-64" />
        </div>

        {/* Loading cover image */}
        <div className="relative h-48 md:h-92">
          <Skeleton className="w-full h-full" />
        </div>

        {/* Loading content */}
        <div className="px-8 space-y-4">
          <Skeleton className="h-12 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderArticleContent = () => (
    <div className="flex-1 overflow-auto">
      <div className="relative h-48 md:h-92 bg-gradient-to-r from-blue-400 to-purple-500 cursor-pointer group">
        <img
          src="/placeholder.svg"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <Button variant="secondary" size="sm" className="gap-2">
            <Camera className="h-4 w-4" />
            Change Cover
          </Button>
        </div>
      </div>
      <div className="px-8">
        <SimpleEditor />
      </div>
    </div>
  );

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

        {!selectedArticle && renderEmptyState()}
        {selectedArticle && isLoading && renderLoadingState()}
        {selectedArticle && !isLoading && renderArticleContent()}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Workspace;
