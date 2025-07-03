import { Camera } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import type { IArticle } from "@/types";
import { useWorkspace } from "../use-workspace";

interface RenderArticleContentProps {
  contentArticle?: IArticle;
  triggerFileInput: () => void;
  isPendingUpload: boolean;
}

export const RenderArticleContent = ({
  contentArticle,
  triggerFileInput,
  isPendingUpload,
}: RenderArticleContentProps) => {
  const [imageLoading, setImageLoading] = useState(true);
  const { editorContent, setEditorContent } = useWorkspace();
  return (
    <div className="flex-1 overflow-auto">
      <div className="relative h-48 md:h-92 bg-gradient-to-r from-blue-400 to-purple-500 group">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/30">
            <span className="text-white font-semibold">Loading...</span>
          </div>
        )}
        <img
          src={contentArticle?.image || "/placeholder.svg"}
          alt="cover"
          className="w-full h-full object-cover"
          onLoad={() => setImageLoading(false)}
          onError={() => setImageLoading(false)}
          style={imageLoading ? { visibility: "hidden" } : {}}
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <Button
            variant="secondary"
            size="sm"
            className="gap-2"
            onClick={triggerFileInput}
            disabled={isPendingUpload}
          >
            <Camera className="h-4 w-4" />
            {isPendingUpload ? "Uploading..." : "Change Cover"}
          </Button>
        </div>
      </div>
      <div className="px-8">
        <SimpleEditor
          onContentChange={(content: string) => setEditorContent?.(content)}
          defaultContent={editorContent}
        />
      </div>
    </div>
  );
};
