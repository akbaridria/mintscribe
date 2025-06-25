import { useState } from "react";
import { AnimatePresence } from "motion/react";
import Article from "./article";
import type { BlogPost } from "@/types";
import { blogPosts } from "@/data";

export default function ArticlesList() {
  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null);

  const handleArticleClick = (article: BlogPost) => {
    setSelectedArticle(article);
  };

  const handleCloseModal = () => {
    setSelectedArticle(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
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
