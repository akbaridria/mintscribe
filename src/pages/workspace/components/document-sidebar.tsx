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

const articles = [
  { id: 1, title: "Getting Started", isActive: true },
  { id: 2, title: "API Reference", isActive: false },
  { id: 3, title: "Examples", isActive: false },
  { id: 4, title: "Deployment", isActive: false },
];

export function DocumentSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Articles</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {articles.map((article) => (
                <SidebarMenuItem key={article.id}>
                  <SidebarMenuButton isActive={article.isActive}>
                    <FileText className="w-4 h-4" />
                    <span>{article.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Plus className="w-4 h-4" />
              <span>New Article</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
