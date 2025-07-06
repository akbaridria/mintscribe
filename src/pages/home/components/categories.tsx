import { useGetAllCategories } from "@/api/query";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Link, useSearchParams } from "react-router-dom";

function CategorySkeleton() {
  return (
    <div className="flex items-center justify-between py-1">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-5 w-8 rounded-full" />
    </div>
  );
}

const Categories = () => {
  const { data, isLoading, error } = useGetAllCategories();
  const [search] = useSearchParams();

  const selectedCategory = search.get("category");

  return (
    <Card className="">
      <CardHeader>
        <h3 className="font-bold">Categories</h3>
      </CardHeader>
      <CardContent className="space-y-2">
        {isLoading && (
          <>
            {Array.from({ length: 6 }).map((_, index) => (
              <CategorySkeleton key={`category-skeleton-${index}`} />
            ))}
          </>
        )}

        {error && (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              Failed to load categories
            </p>
          </div>
        )}

        {!isLoading &&
          !error &&
          data?.map((category) => (
            <div
              key={category.category}
              className="flex items-center justify-between py-1"
            >
              <Link
                to={`?category=${category.category}`}
                className={cn("text-sm hover:text-primary transition-colors", {
                  "text-primary font-bold": selectedCategory === category.category,
                  "text-muted-foreground":
                    selectedCategory !== category.category,
                })}
              >
                {category.category}
              </Link>
              <Badge variant="secondary" className="text-xs">
                {category.count}
              </Badge>
            </div>
          ))}

        {!isLoading && !error && (!data || data.length === 0) && (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">No categories found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Categories;
