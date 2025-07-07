import { FileText, Plus } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  useGetListOfArticlesByAddress,
  useCreateNewArticle,
} from "@/api/query";
import { useAccount } from "wagmi";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useMemo, useCallback } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export function DocumentSidebar() {
  const { id } = useParams();
  const { address } = useAccount();
  const {
    data,
    isLoading,
    refetch: refetchListOfArticles,
  } = useGetListOfArticlesByAddress(address?.toLowerCase() || "");
  const { mutateAsync } = useCreateNewArticle();
  const navigate = useNavigate();

  const articles = useMemo(() => {
    if (data && data.length > 0) {
      return data.map(
        ({ article }: { article: { id: string; title: string } }) => article
      );
    }
    return [];
  }, [data]);

  const handleCreateNew = useCallback(async () => {
    try {
      const newArticle = await mutateAsync({ wallet_address: address || "" });
      if (newArticle && newArticle.id) {
        refetchListOfArticles();
        navigate(`/workspace/${newArticle.id}`);
      }
    } catch {
      toast.error("Failed to create new article. Please try again.");
    }
  }, [mutateAsync, address, navigate, refetchListOfArticles]);

  const articleListContent = useMemo(() => {
    if (isLoading) {
      return Array.from({ length: 10 }).map((_, idx) => (
        <SidebarMenuItem key={idx}>
          <SidebarMenuButton>
            <Skeleton className="w-4 h-4 mr-2" />
            <Skeleton className="h-4 w-32" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      ));
    } else if (articles.length > 0) {
      return articles.map((article) => (
        <SidebarMenuItem key={article.id}>
          <Link
            to={`/workspace/${article.id}`}
            style={{ display: "flex", width: "100%" }}
          >
            <SidebarMenuButton isActive={id === article.id}>
              <FileText className="w-4 h-4" />
              <span>{article.title || "Untitle Article"}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ));
    } else {
      return (
        <div className="px-4 py-2 text-muted-foreground text-sm">
          No articles found.
        </div>
      );
    }
  }, [isLoading, articles, id]);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Your Articles</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{articleListContent}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleCreateNew}>
              <Plus className="w-4 h-4" />
              <span>New Article</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
