import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { UserDetail } from "@/types";
import { useParams } from "react-router-dom";
import { formatAddress } from "@/lib/utils";
import { useMemo } from "react";

interface ProfileInfoProps {
  userDetail?: UserDetail;
  isFollowing: boolean;
  isLoading: boolean;
  isOwner: boolean;
  onFollowToggle: () => void;
  onEditClick: () => void;
}

export function ProfileInfo({
  userDetail,
  isFollowing,
  isLoading,
  isOwner,
  onFollowToggle,
  onEditClick,
}: ProfileInfoProps) {
  const { id } = useParams();

  const user = useMemo(() => userDetail?.user, [userDetail]);

  if (isLoading) {
    return (
      <>
        <div>
          <Skeleton className="h-8 w-48 mb-1" />
          <Skeleton className="h-5 w-64" />
        </div>
        <Skeleton className="h-5 w-96 my-2" />
        <Skeleton className="h-5 w-96 my-2" />
        <Skeleton className="h-5 w-96 my-2" />
        <div className="flex items-center gap-6 text-sm">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="flex items-center gap-3 mt-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-32" />
        </div>
      </>
    );
  }

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-1">
          {user?.name || "Anonymous User"}
        </h1>
        <p className="text-muted-foreground text-lg">
          {id ? formatAddress(id) : "-"}
        </p>
      </div>

      <p className="text-foreground leading-relaxed max-w-2xl">
        {user?.bio || "-"}
      </p>

      <div className="flex items-center gap-6 text-sm">
        <span>
          <strong className="text-foreground">
            {userDetail?.total_articles || 0}
          </strong>{" "}
          <span className="text-muted-foreground">Followers</span>
        </span>
        <span>
          <strong className="text-foreground">
            {userDetail?.total_following || 0}
          </strong>{" "}
          <span className="text-muted-foreground">Following</span>
        </span>
        <span>
          <strong className="text-foreground">
            {userDetail?.total_followers || 0}
          </strong>{" "}
          <span className="text-muted-foreground">Articles</span>
        </span>
      </div>

      <div className="flex items-center gap-3">
        {!isOwner && (
          <Button
            onClick={onFollowToggle}
            variant={isFollowing ? "secondary" : "default"}
          >
            {isFollowing ? "Following" : "Follow"}
          </Button>
        )}
        {isOwner && (
          <Button variant="outline" onClick={onEditClick}>
            <Settings className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>
    </>
  );
}
