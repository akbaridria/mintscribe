import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { User } from "@/types";
import { Twitter, Github, Linkedin } from "lucide-react";

interface AboutTabProps {
  user?: User;
}

const AboutTab: React.FC<AboutTabProps> = ({ user }) => {
  return (
    <Card className="border border-gray-200">
      <CardHeader>
        <h3 className="text-xl font-bold">About</h3>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-semibold mb-2">Bio</h4>
          <p className="text-gray-600 leading-relaxed">{user?.bio || '-'}</p>
        </div>

        <Separator />

        <div>
          <h4 className="font-semibold mb-3">Connect</h4>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" disabled={!user?.socialLinks?.twitter}>
              <Twitter className="w-4 h-4 mr-2" />
              Twitter
            </Button>
            <Button variant="outline" size="sm" disabled={!user?.socialLinks?.github}>
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </Button>
            <Button variant="outline" size="sm" disabled={!user?.socialLinks?.linkedin}>
              <Linkedin className="w-4 h-4 mr-2" />
              LinkedIn
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AboutTab;
