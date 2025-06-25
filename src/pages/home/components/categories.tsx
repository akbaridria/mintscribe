import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";

const categories = [
  { name: "Technology", count: 12 },
  { name: "React", count: 8 },
  { name: "TypeScript", count: 6 },
  { name: "Next.js", count: 5 },
  { name: "CSS", count: 4 },
  { name: "Database", count: 3 },
  { name: "Performance", count: 7 },
];

const Categories = () => {
  return (
    <Card className="">
      <CardHeader>
        <h3 className="font-bold">Categories</h3>
      </CardHeader>
      <CardContent className="space-y-2">
        {categories.map((category) => (
          <div
            key={category.name}
            className="flex items-center justify-between py-1"
          >
            <Link
              to="#"
              className="text-sm hover:text-primary transition-colors"
            >
              {category.name}
            </Link>
            <Badge variant="secondary" className="text-xs">
              {category.count}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default Categories;
