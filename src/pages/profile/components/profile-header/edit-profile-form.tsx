"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Twitter, Github, Linkedin } from "lucide-react";
import type { User } from "@/types";

interface EditProfileFormProps {
  user: User;
  onSave: (user: User) => void;
  onCancel: () => void;
  onChange: (field: string, value: string) => void;
  onSocialChange: (platform: string, value: string) => void;
}

export function EditProfileForm({
  user,
  onSave,
  onCancel,
  onChange,
  onSocialChange,
}: EditProfileFormProps) {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={user.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="Enter your full name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={user.username}
            onChange={(e) => onChange("username", e.target.value)}
            placeholder="@username"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={user.bio}
          onChange={(e) => onChange("bio", e.target.value)}
          placeholder="Tell us about yourself..."
          rows={4}
          className="resize-none"
        />
        <p className="text-xs text-gray-500">
          {user.bio.length}/500 characters
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={user.location}
            onChange={(e) => onChange("location", e.target.value)}
            placeholder="City, Country"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={user.website}
            onChange={(e) => onChange("website", e.target.value)}
            placeholder="yourwebsite.com"
          />
        </div>
      </div>

      <div className="space-y-4">
        <Label>Social Links</Label>
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center gap-3">
            <Twitter className="w-5 h-5 text-blue-500" />
            <Input
              value={user.socialLinks.twitter}
              onChange={(e) => onSocialChange("twitter", e.target.value)}
              placeholder="Twitter username"
              className="flex-1"
            />
          </div>
          <div className="flex items-center gap-3">
            <Github className="w-5 h-5 text-gray-700" />
            <Input
              value={user.socialLinks.github}
              onChange={(e) => onSocialChange("github", e.target.value)}
              placeholder="GitHub username"
              className="flex-1"
            />
          </div>
          <div className="flex items-center gap-3">
            <Linkedin className="w-5 h-5 text-blue-600" />
            <Input
              value={user.socialLinks.linkedin}
              onChange={(e) => onSocialChange("linkedin", e.target.value)}
              placeholder="LinkedIn username"
              className="flex-1"
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="flex items-center gap-3">
        <Button
          onClick={() => onSave(user)}
          className="bg-green-600 hover:bg-green-700"
        >
          Save Changes
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
