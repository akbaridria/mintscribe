import { useState } from "react";
import { AnimatePresence } from "motion/react";
import Article from "./article";
import type { IArticle } from "@/types";
import { blogPosts } from "@/data";

export default function ArticlesList() {
  const [selectedArticle, setSelectedArticle] = useState<IArticle | null>(null);

  const handleArticleClick = (article: IArticle) => {
    setSelectedArticle(article);
  };

  const handleCloseModal = () => {
    setSelectedArticle(null);
  };

  return (
    <div className="w-full space-y-8">
      <div className="grid gap-8">
        {blogPosts.map((article) => (
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
      </div>

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
