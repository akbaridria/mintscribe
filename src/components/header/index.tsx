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
import { useModal } from "connectkit";
import { LiquidButton } from "../animate-ui/buttons/liquid";
import { useAccount, useSwitchChain } from "wagmi";
import { useCallback, useEffect } from "react";
import { SUPPORTED_CHAINS } from "@/config";

const Header = () => {
  const { isConnected, chainId, address } = useAccount();
  const { switchChain } = useSwitchChain();

  useEffect(() => {
    if (!isConnected || !chainId) return;

    if (!SUPPORTED_CHAINS.includes(chainId)) {
      switchChain({ chainId: SUPPORTED_CHAINS[0] });
    }
  }, [isConnected, chainId, switchChain]);
  const { setOpen } = useModal();

  const renderHeadertoolbar = useCallback(() => {
    if (address)
      return (
        <>
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
              <Link to={`/workspace`}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative transition-all hover:scale-105"
                >
                  <PenLine className="h-4 w-4" />
                  <span className="sr-only">Write article</span>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>Write new article</TooltipContent>
          </Tooltip>
          <ProfileDropdown />
        </>
      );
    return <LiquidButton onClick={() => setOpen(true)}>Login</LiquidButton>;
  }, [address, setOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full max-w-7xl flex h-16 items-center justify-between px-2 m-auto">
        <Link to="/">
          <Logo />
        </Link>
        <div className="flex items-center space-x-2">
          {renderHeadertoolbar()}
        </div>
      </div>
    </header>
  );
};

export default Header;
