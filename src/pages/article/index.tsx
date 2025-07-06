import React, { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Clock, Calendar, Coins } from "lucide-react";
import Avatar from "boring-avatars";
import { useGetArticleById, useGetCoinDetail } from "@/api/query";
import { useParams } from "react-router-dom";
import type { IArticle, ICoinData, User } from "@/types";
import { formatAddress } from "@/lib/utils";
import DialogBuyCoin from "./components/dialog-buy-coin";
import CommentsSection from "./components/comment-section";

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
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 500) + 50);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
  };

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
          {article.is_published && (
            <Badge variant="outline" className="text-sm">
              Published
            </Badge>
          )}
          {coinData?.address && (
            <Badge variant="outline" className="text-sm">
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
          <div className="flex items-center gap-4">
            <Avatar name={article.author} size={40} variant="beam" />
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
        </div>
      </div>

      {coinData?.address && (
        <Card className="mb-8 p-0">
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
                <div className="flex items-center gap-4 flex-wrap justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="font-medium">Contract Address:</span>
                    <code className="bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-md text-sm font-mono text-gray-800">
                      {formatAddress(coinData.address || "")}
                    </code>
                  </div>
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
            src={article.image}
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
          <div className="flex items-center gap-6">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200 ${
                isLiked
                  ? "bg-red-50 text-red-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
              <span className="text-sm font-medium">{likes}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailArticle = () => {
  const { id } = useParams();
  const { data: article } = useGetArticleById(id);
  const { data: coinData } = useGetCoinDetail(article?.article?.ca);

  const coinInfo = useMemo(
    () => ({
      name: coinData?.name,
      address: coinData?.address,
      symbol: coinData?.symbol,
    }),
    [coinData]
  );

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading article...</p>
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
      <CommentsSection />
    </div>
  );
};

export default DetailArticle;
