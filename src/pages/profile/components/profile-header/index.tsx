import { ProfileInfo } from "./profile-info";
import { EditProfileForm } from "./edit-profile-form";
import type { User } from "@/types";

interface ProfileHeaderProps {
  user: User;
  editedUser: User;
  isEditing: boolean;
  isFollowing: boolean;
  onFollowToggle: () => void;
  onEditClick: () => void;
  onSave: (user: User) => void;
  onCancel: () => void;
  onChange: (field: string, value: string) => void;
  onSocialChange: (platform: string, value: string) => void;
}

export function ProfileHeader({
  user,
  editedUser,
  isEditing,
  isFollowing,
  onFollowToggle,
  onEditClick,
  onSave,
  onCancel,
  onChange,
  onSocialChange,
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
                user={user}
                isFollowing={isFollowing}
                onFollowToggle={onFollowToggle}
                onEditClick={onEditClick}
              />
            ) : (
              <EditProfileForm
                user={editedUser}
                onSave={onSave}
                onCancel={onCancel}
                onChange={onChange}
                onSocialChange={onSocialChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
