import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const RenderEmptyState = ({
  handleCreateNew,
  isPending,
}: {
  handleCreateNew: () => void;
  isPending: boolean;
}) => (
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
          Choose an existing article from the sidebar or create a new one to get
          started.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          onClick={handleCreateNew}
          className="gap-2"
          disabled={isPending}
        >
          <Plus className="h-4 w-4" />
          Create New Article
        </Button>
      </div>
    </div>
  </div>
);

export const RenderLoadingState = () => (
  <div className="flex-1 overflow-auto">
    <div className="space-y-4">
      <div className="px-8 py-4 border-b">
        <Skeleton className="h-8 w-64" />
      </div>
      <div className="relative h-48 md:h-92">
        <Skeleton className="w-full h-full" />
      </div>
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
