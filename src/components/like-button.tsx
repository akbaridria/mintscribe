import { Heart } from "lucide-react";
import { IconButton } from "./animate-ui/buttons/icon";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  useAddLikes,
  useGetAllLikesFromArticle,
  useGetIsUserLikes,
  useRemoveLikes,
} from "@/api/query";
import { useAccount } from "wagmi";

interface LikeButtonProps {
  id: string;
  disabled?: boolean;
}

const LikeButton: React.FC<LikeButtonProps> = ({ id, disabled = false }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const { address } = useAccount();

  const { data: dataLikes } = useGetAllLikesFromArticle(id);
  const { data: isUserLikes, isLoading } = useGetIsUserLikes(
    id,
    address?.toLowerCase() || ""
  );
  const { mutate: addLikes } = useAddLikes();
  const { mutate: removeLikes } = useRemoveLikes();

  useEffect(() => {
    setIsLiked(isUserLikes?.isLiked || false);
  }, [isUserLikes]);

  useEffect(() => {
    setLikes(dataLikes?.totalLikes || 0);
  }, [dataLikes]);

  const handleLikes = useCallback(() => {
    if (isLiked) {
      removeLikes({ id, wallet_address: address?.toLowerCase() });
      setLikes((prev) => prev - 1);
    } else {
      addLikes({ id, wallet_address: address?.toLowerCase() });
      setLikes((prev) => prev + 1);
    }
    setIsLiked((prev) => !prev);
  }, [isLiked, addLikes, id, address, removeLikes]);

  return (
    <div className="flex items-center">
      <IconButton
        icon={Heart}
        active={isLiked}
        onClick={handleLikes}
        color={[231, 0, 11]}
        disabled={isLoading || disabled}
      />

      <span
        className={cn("text-sm font-medium", {
          "text-red-500": isLiked,
          "text-gray-500": !isLiked,
        })}
      >
        {likes}
      </span>
    </div>
  );
};

export default LikeButton;
