import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { User } from "@/types";

interface ProfileInfoProps {
  user?: User;
  isFollowing: boolean;
  onFollowToggle: () => void;
  onEditClick: () => void;
}

export function ProfileInfo({
  user,
  isFollowing,
  onFollowToggle,
  onEditClick,
}: ProfileInfoProps) {
  return (
    <>
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-1">{user?.name || '-'}</h1>
        <p className="text-muted-foreground text-lg">{user?.walletAddress || '-'}</p>
      </div>

      <p className="text-foreground leading-relaxed max-w-2xl">{user?.bio || '-'}</p>

      <div className="flex items-center gap-6 text-sm">
        <span>
          <strong className="text-foreground">18</strong>{" "}
          <span className="text-muted-foreground">Followers</span>
        </span>
        <span>
          <strong className="text-foreground">{18}</strong>{" "}
          <span className="text-muted-foreground">Following</span>
        </span>
        <span>
          <strong className="text-foreground">{18}</strong>{" "}
          <span className="text-muted-foreground">Articles</span>
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Button
          onClick={onFollowToggle}
          variant={isFollowing ? "secondary" : "default"}
        >
          {isFollowing ? "Following" : "Follow"}
        </Button>
        <Button variant="outline" onClick={onEditClick}>
          <Settings className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </div>
    </>
  );
}
