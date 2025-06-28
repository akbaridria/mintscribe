import { blogPosts } from "@/data";
import { ArticleCard } from "../article-card";

const ListArticleTab = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {blogPosts.map((article) => (
        <ArticleCard article={article} />
      ))}
    </div>
  );
};

export default ListArticleTab;
