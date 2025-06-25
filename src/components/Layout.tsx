import { Outlet } from "react-router-dom";
import Header from "./header/index";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="py-6 border-t text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} MintScribe. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
