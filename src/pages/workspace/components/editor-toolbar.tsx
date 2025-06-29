"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bold,
  Italic,
  Underline,
  Code,
  Link,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  Table,
  MoreHorizontal,
} from "lucide-react";

interface EditorToolbarProps {
  onAction: (action: string) => void;
  isActive: (name: string) => boolean;
}

export function EditorToolbar({ onAction, isActive }: EditorToolbarProps) {
  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-[128px] z-40">
      <div className="flex items-center gap-1 p-2 overflow-x-auto">
        {/* Heading Controls */}
        <div className="flex items-center gap-1">
          <Button
            variant={isActive("h1") ? "default" : "ghost"}
            size="sm"
            onClick={() => onAction("h1")}
          >
            <Heading1 className="w-4 h-4" />
          </Button>
          <Button
            variant={isActive("h2") ? "default" : "ghost"}
            size="sm"
            onClick={() => onAction("h2")}
          >
            <Heading2 className="w-4 h-4" />
          </Button>
          <Button
            variant={isActive("h3") ? "default" : "ghost"}
            size="sm"
            onClick={() => onAction("h3")}
          >
            <Heading3 className="w-4 h-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Text Formatting */}
        <div className="flex items-center gap-1">
          <Button
            variant={isActive("bold") ? "default" : "ghost"}
            size="sm"
            onClick={() => onAction("bold")}
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            variant={isActive("italic") ? "default" : "ghost"}
            size="sm"
            onClick={() => onAction("italic")}
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button
            variant={isActive("underline") ? "default" : "ghost"}
            size="sm"
            onClick={() => onAction("underline")}
          >
            <Underline className="w-4 h-4" />
          </Button>
          <Button
            variant={isActive("code") ? "default" : "ghost"}
            size="sm"
            onClick={() => onAction("code")}
          >
            <Code className="w-4 h-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Lists and Blocks */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm">
            <Link className="w-4 h-4" />
          </Button>
          <Button
            variant={isActive("bulletList") ? "default" : "ghost"}
            size="sm"
            onClick={() => onAction("bulletList")}
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant={isActive("orderedList") ? "default" : "ghost"}
            size="sm"
            onClick={() => onAction("orderedList")}
          >
            <ListOrdered className="w-4 h-4" />
          </Button>
          <Button
            variant={isActive("blockquote") ? "default" : "ghost"}
            size="sm"
            onClick={() => onAction("blockquote")}
          >
            <Quote className="w-4 h-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Media and Advanced */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm">
            <ImageIcon className="w-4 h-4" />
          </Button>
          <Button
            variant={isActive("table") ? "default" : "ghost"}
            size="sm"
            onClick={() => onAction("table")}
          >
            <Table className="w-4 h-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onAction("codeBlock")}>
                Code Block
              </DropdownMenuItem>
              <DropdownMenuItem>Callout</DropdownMenuItem>
              <DropdownMenuItem>Divider</DropdownMenuItem>
              <DropdownMenuItem>Embed</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
