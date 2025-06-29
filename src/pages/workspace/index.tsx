import { useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DocumentSidebar } from "./components/document-sidebar";
import { EditorHeader } from "./components/editor-header";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

const Workspace = () => {
  const [title, setTitle] = useState("Untitled Article");
  const [isPublished, setIsPublished] = useState(false);

  return (
    <SidebarProvider>
      <DocumentSidebar />
      <SidebarInset className="max-h-[calc(100vh-64px)]">
        <EditorHeader
          title={title}
          onTitleChange={setTitle}
          isPublished={isPublished}
          onPublishToggle={setIsPublished}
        />
        <div className="flex-1 overflow-auto">
          <div className="relative h-48 md:h-92 bg-gradient-to-r from-blue-400 to-purple-500 cursor-pointer group">
            <img src="" alt="" className="w-full h-full object-cover" />

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
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Workspace;
