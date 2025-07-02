import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { IArticle } from "@/types";
import { IconButton } from "@/components/animate-ui/buttons/icon";
import Avatar from "boring-avatars";
import { Button } from "@/components/ui/button";
interface ArticleCardProps {
  article: IArticle;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="p-4 border border-border/40 max-w-3xl mx-auto">
      <div className="flex gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <Avatar name={article.author} className="w-8 h-8" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground hover:text-foreground/80 cursor-pointer">
                {"Anonymous"}
              </span>
              <span>·</span>
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground/80"
              >
                Follow
              </Button>
            </div>
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-bold text-foreground mb-2 line-clamp-2 leading-tight cursor-pointer hover:text-foreground/80">
              {article.title}
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed line-clamp-3 cursor-pointer">
              {article.excerpt}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs px-2 py-1">
                  {article.category}
                </Badge>
                <span>{article.date}</span>
                <span>·</span>
                <span>{article.readTime}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4">
              <div className="flex items-center text-muted-foreground">
                <IconButton icon={Heart} color={[0, 0, 0]} size="sm" />
                <span className="text-sm text-foreground">{24}</span>
              </div>
            </div>
          </div>
        </div>

        {article.image && (
          <div className="flex-shrink-0">
            <div className="w-28 h-28 bg-muted rounded overflow-hidden cursor-pointer">
              <img
                src={article.image || "/placeholder.svg"}
                alt={article.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
              />
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
