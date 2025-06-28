import { PenLine, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "../logo";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "react-router-dom";
import NotificationDropdown from "./notification-dropdown";
import ProfileDropdown from "./profile-dropdown";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full max-w-7xl flex h-16 items-center justify-between px-2 m-auto">
        <Link to="/">
          <Logo />
        </Link>
        <div className="flex items-center space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to="/search">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative transition-all hover:scale-105"
                >
                  <Search className="h-4 w-4" />
                  <span className="sr-only">Search articles</span>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>Search articles</TooltipContent>
          </Tooltip>
          <NotificationDropdown />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative transition-all hover:scale-105"
              >
                <PenLine className="h-4 w-4" />
                <span className="sr-only">Write article</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Write new article</TooltipContent>
          </Tooltip>
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};

export default Header;
