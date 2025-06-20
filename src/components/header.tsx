import { Feather, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-2 m-auto">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Feather className="h-4 w-4" />
          </div>
          <span className="text-xl font-bold">MintScribe</span>
        </div>

        <nav className="hidden md:flex items-center space-x-6"></nav>

        <div className="flex items-center space-x-4">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search articles..." className="w-64 pl-10" />
          </div>
          <Button size="sm">Login</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
