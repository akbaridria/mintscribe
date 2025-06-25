"use client";

import { motion } from "motion/react";
import { X, ExternalLink, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { BlogPost } from "@/types";

interface ArticleToolbarProps {
  article: BlogPost;
  onClose: () => void;
  onViewFullArticle?: () => void;
}

export function ArticleToolbar({
  onClose,
  onViewFullArticle,
}: ArticleToolbarProps) {
  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 p-4 z-20"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  Public: 20 March 2025
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>This article will be freely available on 20 March 2025</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onViewFullArticle}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="hidden sm:inline">View Full</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Open full article in new tab</p>
              </TooltipContent>
            </Tooltip>
            <Separator orientation="vertical" className="h-6" />

            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="hover:bg-red-50 hover:text-red-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </TooltipProvider>
  );
}
