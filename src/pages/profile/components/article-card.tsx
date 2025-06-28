import { Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { IArticle } from "@/types";
import { IconButton } from "@/components/animate-ui/buttons/icon";
import { MagicCard } from "@/components/magicui/magic-card";

interface ArticleCardProps {
  article: IArticle;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card className="cursor-pointer py-0">
      <MagicCard gradientColor="#D9D9D955" className="p-0">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground mb-2">
                {article.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {article.excerpt}
              </p>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge
                  key={article.category}
                  variant="secondary"
                  className="text-xs"
                >
                  {article.category}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span>{article.date}</span>
                  <span>{article.readTime}</span>
                </div>
                <div className="flex items-center gap-4">
                  <IconButton
                    icon={Heart}
                    active
                    size="sm"
                    color={[255, 0, 0]}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </MagicCard>
    </Card>
  );
}
