import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/radix/tabs";
import type { User } from "@/types";
import AboutTab from "./about-tab";
import ListArticleTab from "./list-article-tab";

interface ProfileTabsProps {
  user?: User;
}

export function ProfileTabs({ user }: ProfileTabsProps) {
  return (
    <Tabs defaultValue="articles" className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="articles">Articles</TabsTrigger>
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="likes">Likes</TabsTrigger>
      </TabsList>

      <TabsContent value="articles" className="mt-6">
        <ListArticleTab />
      </TabsContent>

      <TabsContent value="about" className="mt-6">
        <AboutTab user={user} />
      </TabsContent>

      <TabsContent value="likes" className="mt-6">
        <ListArticleTab />
      </TabsContent>
    </Tabs>
  );
}
