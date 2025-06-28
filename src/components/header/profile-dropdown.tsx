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

interface UserProfile {
  name: string;
  bio: string;
  walletAddress: string;
  avatar?: string;
  followers: number;
  following: number;
  articles: number;
}

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profile] = useState<UserProfile>({
    name: "John Doe",
    bio: "Frontend Developer passionate about React and TypeScript. Love building beautiful user interfaces.",
    walletAddress: "0x71C7DE1...976FSFF",
    followers: 1234,
    following: 567,
    articles: 42,
  });

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

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
            name={profile.name}
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
          <div className="px-3 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 ring-2 ring-blue-200 rounded-full" />
              <div>
                <div className="font-semibold text-slate-900 flex items-center gap-1">
                  John Doe
                </div>
                <div className="text-xs text-slate-600">
                  {profile.walletAddress}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between text-center">
            <div className="flex-1">
              <div className="font-semibold text-lg">
                {formatNumber(profile.articles)}
              </div>
              <div className="text-xs text-muted-foreground">Articles</div>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-lg">
                {formatNumber(profile.followers)}
              </div>
              <div className="text-xs text-muted-foreground">Followers</div>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-lg">
                {formatNumber(profile.following)}
              </div>
              <div className="text-xs text-muted-foreground">Following</div>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground px-3 py-2">
          Account
        </DropdownMenuLabel>

        <DropdownMenuItem
          className="cursor-pointer mx-1 my-0.5 py-2.5 rounded-sm"
          asChild
        >
          <User className="w-4 h-4 mr-3 text-muted-foreground" />
          <div>Your Profile</div>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer mx-1 my-0.5 py-2.5 rounded-sm"
          asChild
        >
          <Briefcase className="w-4 h-4 mr-3 text-muted-foreground" />
          <div>Your Workspace</div>
        </DropdownMenuItem>

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
