import { ProfileInfo } from "./profile-info";
import { EditProfileForm } from "./edit-profile-form";
import type { User, UserDetail } from "@/types";

interface ProfileHeaderProps {
  userDetail?: UserDetail;
  isEditing: boolean;
  isFollowing: boolean;
  isLoading: boolean;
  isOwner: boolean;
  onFollowToggle: () => void;
  onEditClick: () => void;
  onSave: (user: Partial<User>) => void;
  onCancel: () => void;
}

export function ProfileHeader({
  userDetail,
  isEditing,
  isFollowing,
  isLoading,
  isOwner,
  onFollowToggle,
  onEditClick,
  onSave,
  onCancel,
}: ProfileHeaderProps) {
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="h-48 bg-gradient-to-r from-primary/20 to-primary/40 relative">
        <div className="absolute inset-0 bg-primary" />
      </div>
      <div className="p-8 relative">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="flex-1 space-y-4">
            {!isEditing ? (
              <ProfileInfo
                userDetail={userDetail}
                isOwner={isOwner}
                isLoading={isLoading}
                isFollowing={isFollowing}
                onFollowToggle={onFollowToggle}
                onEditClick={onEditClick}
              />
            ) : (
              <EditProfileForm
                user={userDetail?.user}
                onSave={onSave}
                onCancel={onCancel}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
