import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { useDebounceValue } from "usehooks-ts";
import ListArticles from "@/components/list-articles";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [debounceValue, setDebounceValue] = useDebounceValue("", 500);
  const navigate = useNavigate();

  useEffect(() => {
    navigate("?search=" + debounceValue);
  }, [debounceValue, navigate]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 bg-white px-2 py-4 lg:px-4 lg:py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Articles</h1>
        <p className="text-muted-foreground">
          Discover the latest articles on everything from crowdfunding to
          personal stories
        </p>
      </div>
      <div className="flex items-center justify-between space-x-4 mb-6">
        <div className="relative w-full">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search articles, authors, or topics..."
            className="pl-10 w-full"
            onChange={(e) => setDebounceValue(e.target.value)}
          />
        </div>
      </div>
      <ListArticles />
    </div>
  );
};

export default Search;
