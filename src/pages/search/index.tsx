import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/animate-ui/radix/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SearchIcon, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { blogPosts } from "@/data";
import ListArticles from "@/components/list-articles";

const allCategories = [...new Set(blogPosts.map((post) => post.category))];

const Search = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  const removeCategory = (category: string) => {
    setSelectedCategories((prev) => prev.filter((cat) => cat !== category));
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 bg-white px-2 py-4 lg:px-4 lg:py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Articles</h1>
        <p className="text-muted-foreground">
          Discover the latest articles on web development and programming
        </p>
      </div>
      <div className="flex items-center justify-between space-x-4 mb-6">
        <div className="relative w-full">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search articles, authors, or topics..."
            className="pl-10 w-full"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" asChild>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Select category
              </motion.button>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Categories</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {allCategories.map((category) => (
              <DropdownMenuCheckboxItem
                key={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => handleCategoryToggle(category)}
              >
                {category}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {selectedCategories.length > 0 && (
        <div className="mt-2 mb-4">
          <p className="text-sm text-muted-foreground mb-2">
            Selected categories:
          </p>
          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto p-2 border rounded-md">
            {selectedCategories.map((category) => (
              <Badge
                key={category}
                variant="secondary"
                className="flex items-center gap-1 py-1 px-3"
              >
                {category}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                  onClick={() => removeCategory(category)}
                />
              </Badge>
            ))}
          </div>
        </div>
      )}
      <ListArticles />
    </div>
  );
};

export default Search;
