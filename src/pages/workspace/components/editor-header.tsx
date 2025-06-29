"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Save, Eye, Settings, Loader2 } from "lucide-react";
import Avatar from "boring-avatars";

interface EditorHeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  isPublished: boolean;
  onPublishToggle: (published: boolean) => void;
}

export function EditorHeader({
  title,
  onTitleChange,
  isPublished,
  onPublishToggle,
}: EditorHeaderProps) {
  const [isSaving, setIsSaving] = useState(false);

  // Auto-save simulation
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      if (title !== "Untitled Article") {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 1000);
      }
    }, 2000);

    return () => clearTimeout(saveTimer);
  }, [title]);

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-[64px] z-50">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-2">
            <Input
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              className="text-lg font-semibold border-none shadow-none p-0 h-auto bg-transparent focus-visible:ring-0"
              placeholder="Article title..."
            />
            {isSaving && (
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            )}
          </div>
          <Badge variant={isPublished ? "default" : "secondary"}>
            {isPublished ? "Published" : "Draft"}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button size="sm" onClick={() => onPublishToggle(!isPublished)}>
            <Save className="w-4 h-4 mr-2" />
            {isPublished ? "Update" : "Publish"}
          </Button>
          <Avatar />
        </div>
      </div>
    </header>
  );
}
