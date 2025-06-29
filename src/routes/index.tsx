import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/home";
import Profile from "@/pages/profile";
import Search from "@/pages/search";
import Workspace from "@/pages/workspace";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/profile/:username",
        element: <Profile />,
      },
      {
        path: "/search",
        element: <Search />,
      },
      {
        path: "/workspace",
        element: <Workspace />,
      },
    ],
  },
]);

export default router;
