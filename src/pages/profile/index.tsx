import { ProfileHeader } from "./components/profile-header";
import { ProfileTabs } from "./components/profile-tabs";
import { useProfile } from "./hooks/use-profile";

const Profile = () => {
  const {
    isFollowing,
    isEditing,
    userDetail,
    setIsFollowing,
    setIsEditing,
    handleSave,
    handleCancel,
  } = useProfile();

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <ProfileHeader
            user={userDetail?.user}
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
