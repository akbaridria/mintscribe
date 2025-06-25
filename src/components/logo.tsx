import { Feather } from "lucide-react";

const Logo = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Feather className="h-4 w-4" />
      </div>
      <span className="text-xl font-bold">MintScribe</span>
    </div>
  );
};

export default Logo;
