import { ProfileHeader } from "./components/profile-header";
import { ProfileTabs } from "./components/profile-tabs";
import { useProfile } from "./hooks/use-profile";

const user = {
  name: "Sarah Chen",
  username: "@sarahchen",
  bio: "Senior Software Engineer at Google. Passionate about React, TypeScript, and building accessible web experiences. Writing about frontend development, career growth, and tech industry insights.",
  avatar: "/placeholder.svg?height=120&width=120",
  coverImage: "/placeholder.svg?height=200&width=800",
  location: "San Francisco, CA",
  joinDate: "March 2021",
  website: "sarahchen.dev",
  followers: 12500,
  following: 340,
  articles: 47,
  socialLinks: {
    twitter: "sarahchen_dev",
    github: "sarahchen",
    linkedin: "sarah-chen-dev",
  },
};

const Profile = () => {
  const {
    isFollowing,
    setIsFollowing,
    isEditing,
    setIsEditing,
    editedUser,
    handleSave,
    handleCancel,
    updateEditedUser,
    updateSocialLink,
  } = useProfile(user);

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <ProfileHeader
            user={user}
            editedUser={editedUser}
            isEditing={isEditing}
            isFollowing={isFollowing}
            onFollowToggle={() => setIsFollowing(!isFollowing)}
            onEditClick={() => setIsEditing(true)}
            onSave={handleSave}
            onCancel={handleCancel}
            onChange={updateEditedUser}
            onSocialChange={updateSocialLink}
          />

          <ProfileTabs user={user} />
        </div>
      </div>
    </div>
  );
};
export default Profile;
