import { ArticleCard } from "../article-card";
import { useGetListOfArticlesByAddress } from "@/api/query";
import { useParams } from "react-router-dom";

const ListArticleTab = () => {
  const { id } = useParams();
  const { data: listArticles } = useGetListOfArticlesByAddress(
    id?.toLowerCase() || ""
  );
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {(listArticles || []).map((article) => (
        <ArticleCard article={article?.article} />
      ))}
    </div>
  );
};

export default ListArticleTab;
