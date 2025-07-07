import { LogOut, User, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import Avatar from "boring-avatars";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../animate-ui/radix/dropdown-menu";
import { Link } from "react-router-dom";
import { formatAddress, formatNumber } from "@/lib/utils";
import { useGetUserDetailByAddress } from "@/api/query";
import { useAccount } from "wagmi";

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { address } = useAccount();
  const { data, isLoading } = useGetUserDetailByAddress(address?.toLowerCase() || "");

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-accent rounded-full transition-all hover:scale-105"
          aria-label="User menu"
        >
          <Avatar
            className="!w-7 !h-7 rounded-full ring-2 ring-primary/10 hover:ring-primary/20 transition-all"
            name={address}
            variant="marble"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 shadow-lg border-accent"
        sideOffset={8}
      >
        <div className="p-2">
          {isLoading ? (
            // Loading skeleton
            <div className="px-3 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                  <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                </div>
              </div>
            </div>
          ) : (
            <div className="px-3 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg mb-4">
              <div className="flex items-center gap-3">
                <Avatar
                  className="w-10 h-10 ring-2 ring-blue-200 rounded-full"
                  name={address}
                  variant="marble"
                />
                <div>
                  <div className="font-semibold text-slate-900 flex items-center gap-1">
                    {data?.user.name || "Anonymous User"}
                  </div>
                  <div className="text-xs text-slate-600">
                    {formatAddress(address)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-between text-center">
              <div className="flex-1">
                <div className="h-6 bg-muted rounded animate-pulse mb-1" />
                <div className="h-3 bg-muted rounded animate-pulse" />
              </div>
              <div className="flex-1">
                <div className="h-6 bg-muted rounded animate-pulse mb-1" />
                <div className="h-3 bg-muted rounded animate-pulse" />
              </div>
              <div className="flex-1">
                <div className="h-6 bg-muted rounded animate-pulse mb-1" />
                <div className="h-3 bg-muted rounded animate-pulse" />
              </div>
            </div>
          ) : (
            <div className="flex justify-between text-center">
              <div className="flex-1">
                <div className="font-semibold text-lg">
                  {formatNumber(data?.total_articles || 0)}
                </div>
                <div className="text-xs text-muted-foreground">Articles</div>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-lg">
                  {formatNumber(data?.total_followers || 0)}
                </div>
                <div className="text-xs text-muted-foreground">Followers</div>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-lg">
                  {formatNumber(data?.total_following || 0)}
                </div>
                <div className="text-xs text-muted-foreground">Following</div>
              </div>
            </div>
          )}
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground px-3 py-2">
          Account
        </DropdownMenuLabel>
        <Link to={`/profile/${address}`}>
          <DropdownMenuItem
            className="cursor-pointer mx-1 my-0.5 py-2.5 rounded-sm"
            asChild
          >
            <User className="w-4 h-4 mr-3 text-muted-foreground" />
            <div>Your Profile</div>
          </DropdownMenuItem>
        </Link>

        <Link to="/workspace">
          <DropdownMenuItem
            className="cursor-pointer mx-1 my-0.5 py-2.5 rounded-sm"
            asChild
          >
            <Briefcase className="w-4 h-4 mr-3 text-muted-foreground" />
            <div>Your Workspace</div>
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer mx-1 my-0.5 py-2.5 rounded-sm">
          <LogOut className="w-4 h-4 mr-3 text-red-500" />
          <span className="text-red-500">Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
