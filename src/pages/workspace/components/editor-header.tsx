import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Save, Loader2 } from "lucide-react";
import { useWorkspace } from "../use-workspace";

export function EditorHeader() {
  const { isPendingUpdate, isPublished } = useWorkspace();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-[64px] z-50">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />

          <div className="flex items-center gap-2 flex-1 min-w-0">
            {isPendingUpdate && (
              <div className="flex items-center gap-1">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  Saving...
                </span>
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
          <Button size="sm" className="shrink-0">
            <Save className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Publish</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
