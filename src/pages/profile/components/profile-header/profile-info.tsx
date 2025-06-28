import { MapPin, Calendar, LinkIcon, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { User } from "@/types";

interface ProfileInfoProps {
  user: User;
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
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-1">{user.name}</h1>
        <p className="text-muted-foreground text-lg">{user.username}</p>
      </div>

      <p className="text-foreground leading-relaxed max-w-2xl">{user.bio}</p>

      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          {user.location}
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          Joined {user.joinDate}
        </div>
        <div className="flex items-center gap-1">
          <LinkIcon className="w-4 h-4" />
          <a
            href={`https://${user.website}`}
            className="text-primary hover:underline"
          >
            {user.website}
          </a>
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm">
        <span>
          <strong className="text-foreground">
            {formatNumber(user.followers)}
          </strong>{" "}
          <span className="text-muted-foreground">Followers</span>
        </span>
        <span>
          <strong className="text-foreground">{user.following}</strong>{" "}
          <span className="text-muted-foreground">Following</span>
        </span>
        <span>
          <strong className="text-foreground">{user.articles}</strong>{" "}
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
