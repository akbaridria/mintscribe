import type React from "react";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Calendar, Coins } from "lucide-react";
import Avatar from "boring-avatars";
import { useGetArticleById, useGetCoinDetail } from "@/api/query";
import { Link, useParams } from "react-router-dom";
import type { IArticle, ICoinData, User } from "@/types";
import { formatAddress } from "@/lib/utils";
import DialogBuyCoin from "./components/dialog-buy-coin";
import CommentsSection from "./components/comment-section";
import LikeButton from "@/components/like-button";
import { useAccount } from "wagmi";

interface ArticleDetailProps {
  article: IArticle;
  user: User;
  coinData?: ICoinData;
  onSupportClick?: (contractAddress: string, coinData?: ICoinData) => void;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({
  article,
  user,
  coinData,
}) => {
  const { address } = useAccount();
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary" className="text-sm">
            {article.category}
          </Badge>
          {coinData?.address && (
            <Badge variant="default" className="text-sm">
              ${coinData.symbol}
            </Badge>
          )}
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {article.title}
        </h1>

        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          {article.excerpt}
        </p>

        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <Link to={`/profile/${article.author}`}>
            <div className="flex items-center gap-4">
              <Avatar name={article.author} size={40} />
              <div>
                <h3 className="font-semibold text-gray-900">
                  {user?.name || formatAddress(article.author)}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(article.date)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {article.read_time}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {coinData?.address && (
        <Card className="mb-8 p-0 shadow-none bg-background">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full">
                <Coins className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Support This Article
                </h3>
                <p className="text-gray-600 mb-4">
                  This article has an associated cryptocurrency token. You can
                  purchase tokens to support the author and show your
                  appreciation for their work.
                </p>
                <div className="flex items-center gap-4 flex-wrap justify-end">
                  <DialogBuyCoin coinData={coinData} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {article.image && (
        <div className="mb-8">
          <img
            src={article.image || "/placeholder.svg"}
            alt={article.title}
            className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
          />
        </div>
      )}

      <div
        className="tiptap ProseMirror"
        dangerouslySetInnerHTML={{ __html: article.content || "" }}
      />

      <div className="py-4 mb-8">
        <div className="flex items-center justify-end">
          <LikeButton id={article?.id} disabled={!address} />
        </div>
      </div>
    </div>
  );
};

const ArticleDetailSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        {/* Badges skeleton */}
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>

        {/* Title skeleton */}
        <div className="mb-6">
          <Skeleton className="h-12 w-full mb-2" />
          <Skeleton className="h-12 w-3/4" />
        </div>

        {/* Excerpt skeleton */}
        <div className="mb-8">
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-5/6 mb-2" />
          <Skeleton className="h-6 w-4/5" />
        </div>

        {/* Author section skeleton */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="h-5 w-32 mb-2" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coin support card skeleton */}
      <Card className="mb-8 p-0 shadow-none bg-background">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-6 w-48 mb-2" />
              <div className="mb-4">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="flex justify-end">
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image skeleton */}
      <div className="mb-8">
        <Skeleton className="w-full h-64 md:h-96 rounded-lg" />
      </div>

      {/* Content skeleton */}
      <div className="mb-8">
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <div className="py-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/5" />
        </div>
      </div>

      {/* Like button skeleton */}
      <div className="py-4 mb-8">
        <div className="flex items-center justify-end">
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </div>
  );
};

const DetailArticle = () => {
  const { id } = useParams();
  const { data: article, isLoading } = useGetArticleById(id);
  const { data: coinData } = useGetCoinDetail(article?.article?.ca);
  const { isConnected } = useAccount();

  const coinInfo = useMemo(
    () => ({
      name: coinData?.name,
      address: coinData?.address,
      symbol: coinData?.symbol,
    }),
    [coinData]
  );

  if (isLoading || !article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ArticleDetailSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ArticleDetail
        user={article.author}
        article={article.article}
        coinData={coinInfo}
      />
      {isConnected && <CommentsSection />}
    </div>
  );
};

export default DetailArticle;
