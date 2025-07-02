import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ArrowLeft, Wallet } from "lucide-react";
import { Link } from "react-router-dom";

interface UserNotFoundProps {
  id?: string;
}

const UserNotFound: React.FC<UserNotFoundProps> = ({ id }) => {
  return (
    <div className="flex items-center justify-center h-screen p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-4">
          <div className="flex justify-center mb-4">
            <Wallet className="h-12 w-12 text-muted-foreground" />
          </div>
          <CardTitle className="text-xl font-semibold">
            Wallet Address Not Found
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            The wallet address "{id}" could not be found. Please verify the
            address and try again.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link to="/">
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-transparent"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
            </Link>
          </div>

          <div className="mt-4 p-3 bg-muted rounded-lg text-left">
            <h4 className="font-medium text-sm mb-2">
              Tips for wallet addresses:
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>
                • Ensure the address is complete (42 characters for Ethereum)
              </li>
              <li>• Check for any typos or missing characters</li>
              <li>• Verify the address format is correct</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserNotFound;
