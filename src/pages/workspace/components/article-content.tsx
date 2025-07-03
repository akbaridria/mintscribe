import { Camera } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { useWorkspace } from "../use-workspace";

const defaultContentArticle =
  "<h1>Write your story...</h1><p>Start writing your article here. Use the formatting tools above to add headings, lists, images, and more.</p>";

export const RenderArticleContent = () => {
  const [imageLoading, setImageLoading] = useState(true);
  const { contentArticle, triggerFileInput, isPendingUpload, updateArticle } =
    useWorkspace();
  return (
    <div className="flex-1 overflow-auto">
      <div className="relative h-48 md:h-92 bg-gradient-to-r from-blue-400 to-purple-500 group">
        <img
          src={contentArticle?.image || "/placeholder.svg"}
          alt="cover"
          className="w-full h-full object-cover"
          onLoad={() => setImageLoading(false)}
          onError={() => setImageLoading(false)}
          style={imageLoading ? { visibility: "hidden" } : {}}
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <Button
            variant="secondary"
            size="sm"
            className="gap-2"
            onClick={triggerFileInput}
            disabled={isPendingUpload || imageLoading}
          >
            <Camera className="h-4 w-4" />
            {isPendingUpload
              ? "Uploading..."
              : imageLoading
              ? "Loading..."
              : "Change Cover"}
          </Button>
        </div>
      </div>
      <div className="px-8">
        <SimpleEditor
          onContentChange={(content: string) => {
            updateArticle({ content });
          }}
          defaultContent={contentArticle?.content || defaultContentArticle}
        />
      </div>
    </div>
  );
};
