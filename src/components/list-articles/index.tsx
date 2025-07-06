"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "motion/react";
import Article from "./article";
import type { IArticle } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getListArticles } from "@/api/endpoints";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";

interface ArticleItem {
  article: IArticle;
  author: {
    wallet_address: string;
    name: string;
    bio: string;
    social_links: Record<string, string>;
  };
  likes: number;
}

interface ArticlePageData {
  pages: ArticleItem[];
  nextCursor?: string;
  hasNextPage: boolean;
}

function ArticleSkeleton() {
  return (
    <div className="space-y-4 p-6 border rounded-lg">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[160px]" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex space-x-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}

export default function ArticlesList() {
  const [selectedArticle, setSelectedArticle] = useState<IArticle | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );
  const [searchArticle, setSearchArticle] = useState<string | undefined>(
    undefined
  );
  const [search] = useSearchParams();

  useEffect(() => {
    const category = search.get("category");
    const articleSearch = search.get("search");
    if (articleSearch) setSearchArticle(articleSearch);
    else setSearchArticle(undefined);
    if (category) setSelectedCategory(category);
    else setSelectedCategory(undefined);
  }, [search]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery<ArticlePageData, Error>({
    queryKey: ["articles", selectedCategory, searchArticle],
    queryFn: ({ pageParam }) =>
      getListArticles(
        pageParam as string | undefined,
        selectedCategory,
        searchArticle
      ),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined as string | undefined,
  });

  const handleArticleClick = (article: IArticle) => {
    setSelectedArticle(article);
  };

  const handleCloseModal = () => {
    setSelectedArticle(null);
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const allArticles = useMemo(() => {
    if (!data?.pages || data.pages.length === 0) return [];

    return data.pages.flatMap((page) => {
      return page.pages?.map((item) => item.article) || [];
    });
  }, [data]);

  if (error) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <p className="text-destructive">Failed to load articles</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      <div className="grid gap-8">
        {/* Show skeletons when initially loading */}
        {isLoading && (
          <>
            {Array.from({ length: 6 }).map((_, index) => (
              <ArticleSkeleton key={`skeleton-${index}`} />
            ))}
          </>
        )}

        {/* Show actual articles */}
        {!isLoading &&
          allArticles.map((article: IArticle) => (
            <div key={article.id}>
              {selectedArticle?.id === article.id ? (
                <div className="h-64 md:h-80" />
              ) : (
                <Article
                  article={article}
                  onClick={() => handleArticleClick(article)}
                />
              )}
            </div>
          ))}

        {/* Show skeletons when fetching next page */}
        {isFetchingNextPage && (
          <>
            {Array.from({ length: 3 }).map((_, index) => (
              <ArticleSkeleton key={`loading-skeleton-${index}`} />
            ))}
          </>
        )}
      </div>

      {/* Load More Button */}
      {!isLoading && allArticles.length > 0 && (
        <div className="flex justify-center pt-8">
          {hasNextPage ? (
            <Button
              onClick={handleLoadMore}
              disabled={isFetchingNextPage}
              variant="outline"
              size="lg"
              className="min-w-[140px] bg-transparent"
            >
              {isFetchingNextPage ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Load More"
              )}
            </Button>
          ) : (
            <p className="text-muted-foreground text-sm">
              You've reached the end of the articles
            </p>
          )}
        </div>
      )}

      {/* No articles found */}
      {!isLoading && allArticles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No articles found</p>
        </div>
      )}

      <AnimatePresence>
        {selectedArticle && (
          <Article
            article={selectedArticle}
            isExpanded={true}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
