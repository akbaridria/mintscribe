"use client";
import type React from "react";
import { motion } from "motion/react";
import Avatar from "boring-avatars";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { IArticle } from "@/types";
import { Calendar, Clock, User } from "lucide-react";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { ArticleToolbar } from "./article-toolbar";
import { formatAddress } from "@/lib/utils";
import { format } from "date-fns";
import { useGetCoinDetail } from "@/api/query";
import { useMemo } from "react";
import { Skeleton } from "../ui/skeleton";
import { Link } from "react-router-dom";

interface ArticleProps {
  article: IArticle;
  isExpanded?: boolean;
  onClick?: () => void;
  onClose?: () => void;
}

const CoinInfo: React.FC<{ article: IArticle; className: string }> = ({
  article,
  className,
}) => {
  const { data: coinData, isLoading } = useGetCoinDetail(article?.ca);

  const coinInfo = useMemo(
    () => ({
      name: coinData?.name,
      address: coinData?.address,
      symbol: coinData?.symbol,
    }),
    [coinData]
  );

  if (isLoading) return <Skeleton className="w-[60px] h-[22px]" />;
  if (!coinInfo?.symbol) return null;

  return (
    <motion.div layoutId={`article-coin-${article.id}`}>
      <Badge variant="default" className={className}>
        ${coinInfo?.symbol}
      </Badge>
    </motion.div>
  );
};

const Article: React.FC<ArticleProps> = ({
  article,
  isExpanded = false,
  onClick,
  onClose,
}) => {
  if (isExpanded) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 top-0 h-screen w-screen"
          onClick={onClose}
        />

        <motion.div
          layoutId={`article-${article.id}`}
          className="fixed inset-4 z-50 bg-white rounded-lg shadow-2xl overflow-hidden"
          style={{ maxWidth: "1000px", maxHeight: "90vh", margin: "auto" }}
        >
          <ArticleToolbar article={article} onClose={onClose} />

          <div className="overflow-y-auto h-full pt-16">
            <motion.div
              layoutId={`article-image-${article.id}`}
              className="relative h-64 md:h-80"
            >
              <ImageWithFallback
                src={article.image || "/placeholder.svg"}
                alt={article.title}
                className="w-full h-full object-cover"
                fill
                aspectRatio="16/9"
                fallbackSrc="/placeholder.svg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex gap-2 items-center">
                  <motion.div layoutId={`article-badge-${article.id}`}>
                    <Badge variant="secondary" className="mb-3">
                      {article.category}
                    </Badge>
                  </motion.div>
                  <CoinInfo article={article} className="mb-3" />
                </div>
                <motion.h1
                  layoutId={`article-title-${article.id}`}
                  className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight"
                >
                  {article.title}
                </motion.h1>
              </div>
            </motion.div>

            <div className="p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                <Link to={`/profile/${article.author}`}>
                  <motion.div
                    layoutId={`article-author-${article.id}`}
                    className="flex items-center space-x-3"
                  >
                    <Avatar className="w-12 h-12" name={article.author} />
                    <div>
                      <div className="font-semibold flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {formatAddress(article.author)}
                      </div>
                    </div>
                  </motion.div>
                </Link>

                <motion.div
                  layoutId={`article-meta-${article.id}`}
                  className="flex items-center gap-4 text-sm text-muted-foreground"
                >
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {article.date
                      ? format(new Date(article.date), "MMM d, yyyy")
                      : "No date"}
                  </div>
                  <div>•</div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {article.read_time}
                  </div>
                </motion.div>
              </div>

              <motion.div
                layoutId={`article-excerpt-${article.id}`}
                className="text-lg text-muted-foreground mb-8 leading-relaxed"
              >
                {article.excerpt}
              </motion.div>

              <motion.div
                className="tiptap ProseMirror"
                dangerouslySetInnerHTML={{ __html: article.content || "" }}
              />
            </div>
          </div>
        </motion.div>
      </>
    );
  }

  return (
    <motion.div layoutId={`article-${article.id}`}>
      <Card className="overflow-hidden !p-0 cursor-pointer" onClick={onClick}>
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 relative">
            <motion.div
              layoutId={`article-image-${article.id}`}
              className="aspect-[16/9] md:aspect-[4/3] lg:aspect-[16/9] w-full h-full"
            >
              <ImageWithFallback
                src={article.image || "/placeholder.svg"}
                alt={article.title}
                className="absolute inset-0 w-full h-full object-cover"
                fill
                aspectRatio="16/9"
                fallbackSrc="/placeholder.svg"
              />
            </motion.div>
          </div>

          <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8">
            <div className="flex items-center space-x-2 mb-3 md:mb-4">
              <motion.div layoutId={`article-badge-${article.id}`}>
                <Badge variant="secondary" className="text-xs sm:text-sm">
                  {article.category}
                </Badge>
              </motion.div>
              <CoinInfo article={article} className="text-xs sm:text-sm" />
            </div>

            <motion.h3
              layoutId={`article-title-${article.id}`}
              className="text-lg sm:text-xl md:text-2xl font-bold mb-3 md:mb-4 leading-tight line-clamp-2 overflow-hidden text-ellipsis"
            >
              {article.title}
            </motion.h3>

            <motion.p
              layoutId={`article-excerpt-${article.id}`}
              className="text-muted-foreground mb-4 md:mb-6 leading-relaxed text-sm sm:text-base line-clamp-3 overflow-hidden text-ellipsis"
            >
              {article.excerpt}
            </motion.p>

            <div className="flex items-center justify-between space-y-4 md:space-y-0">
              <motion.div
                layoutId={`article-author-${article.id}`}
                className="flex items-center space-x-3"
              >
                <Avatar
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-6 md:h-6 aspect-square"
                  name={article.author}
                />
                <div className="font-medium text-sm sm:text-base md:text-sm">
                  {formatAddress(article.author)}
                </div>
              </motion.div>

              <motion.div
                layoutId={`article-meta-${article.id}`}
                className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground"
              >
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="whitespace-nowrap">
                    {article.date
                      ? format(new Date(article.date), "MMM d, yyyy")
                      : "No date"}
                  </span>
                </div>
                <div>•</div>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="whitespace-nowrap">{article.read_time}</span>
                </div>
              </motion.div>
            </div>
            <InteractiveHoverButton
              className="mt-4 md:mt-6 w-full sm:w-auto text-sm sm:text-sm"
              onClick={(e) => {
                e?.stopPropagation();
                onClick?.();
              }}
            >
              View Details
            </InteractiveHoverButton>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default Article;
