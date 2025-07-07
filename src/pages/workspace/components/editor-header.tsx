import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Check, Loader2 } from "lucide-react";
import { useWorkspace } from "../use-workspace";
import DialogPublish from "./dialog-publish";

export function EditorHeader() {
  const { isPendingUpdate, isPublished } = useWorkspace();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-[64px] z-50">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />

          <div className="flex items-center gap-2 flex-1 min-w-0">
            {isPendingUpdate ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
                <span className="text-xs text-muted-foreground font-medium">
                  Saving changes...
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-muted-foreground">
                    Auto save
                  </span>
                </div>
                <Badge
                  variant={"default"}
                  className="text-xs px-2 py-0.5 bg-green-100 text-green-700 hover:bg-green-200 border-green-200"
                >
                  <Check className="w-3 h-3 mr-1" />
                  On
                </Badge>
              </div>
            )}
          </div>

          <Badge
            variant={isPublished ? "default" : "secondary"}
            className="shrink-0"
          >
            {isPublished ? "Published" : "Draft"}
          </Badge>
        </div>

        <div className="flex items-center gap-2 ml-4">
          {!isPublished && <DialogPublish />}
        </div>
      </div>
    </header>
  );
}
