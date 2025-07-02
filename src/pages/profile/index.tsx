import { isAddress } from "viem";
import { ProfileHeader } from "./components/profile-header";
import { ProfileTabs } from "./components/profile-tabs";
import { useProfile } from "./hooks/use-profile";
import UserNotFound from "./components/user-not-found";

const Profile = () => {
  const {
    id,
    isFollowing,
    isEditing,
    userDetail,
    isLoading,
    isOwner,
    setIsFollowing,
    setIsEditing,
    handleSave,
    handleCancel,
  } = useProfile();

  if (!isAddress(id || "")) return <UserNotFound id={id} />;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <ProfileHeader
            userDetail={userDetail}
            isOwner={isOwner}
            isLoading={isLoading}
            isEditing={isEditing}
            isFollowing={isFollowing}
            onFollowToggle={() => setIsFollowing(!isFollowing)}
            onEditClick={() => setIsEditing(true)}
            onSave={handleSave}
            onCancel={handleCancel}
          />

          <ProfileTabs user={userDetail?.user} />
        </div>
      </div>
    </div>
  );
};
export default Profile;
