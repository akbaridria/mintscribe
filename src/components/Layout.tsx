import { Outlet } from "react-router-dom";
import Header from "./header/index";
import { Web3Provider } from "./web3-provider";

const Layout = () => {
  return (
    <Web3Provider>
      <div className="max-h-screen flex flex-col overflow-auto">
        <Header />
        <main className="flex-grow">
          <Outlet />
        </main>
        <footer className="py-6 border-t text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} MintScribe. All rights reserved.
        </footer>
      </div>
    </Web3Provider>
  );
};

export default Layout;
