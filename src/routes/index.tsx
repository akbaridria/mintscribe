import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/home";
import Profile from "@/pages/profile";
import Search from "@/pages/search";
import Workspace from "@/pages/workspace";
import DetailArticle from "@/pages/article";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "profile/:id", element: <Profile /> },
      { path: "search", element: <Search /> },
      { path: "workspace", element: <Workspace /> },
      { path: "workspace/:id", element: <Workspace /> },
      { path: "article/:id", element: <DetailArticle /> },
    ],
  },
]);

export default router;
