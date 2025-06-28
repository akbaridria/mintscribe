import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/home";
import Profile from "@/pages/profile";
import Search from "@/pages/search";

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
    ],
  },
]);

export default router;
