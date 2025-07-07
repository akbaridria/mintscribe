import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Avatar from "boring-avatars";
import { formatAddress } from "@/lib/utils";
import type { Comment } from "@/types";
import { useGetCommentFromArticle, usePublishComment } from "@/api/query";
import { useParams } from "react-router-dom";
import { useAccount } from "wagmi";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";

function CommentItem({ comment }: { comment: Comment }) {
  return (
    <div className="py-6 border-b border-gray-100 last:border-b-0">
      <div className="flex items-start gap-3">
        <Avatar name={comment.wallet_address} className="w-10 h-10" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-sm text-gray-900">
              {comment.author.name ||
                formatAddress(comment?.wallet_address)}
            </span>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-500">
              {comment.timestamp
                ? formatDistanceToNow(new Date(comment.timestamp), {
                    addSuffix: true,
                  })
                : ""}
            </span>
          </div>

          <p className="text-gray-800 text-sm leading-relaxed">
            {comment.content}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CommentsSection() {
  const [newComment, setNewComment] = useState("");
  const { id } = useParams();
  const { address } = useAccount();
  const { data: listComments } = useGetCommentFromArticle(id || "");
  const { mutateAsync: publishComment, isPending } = usePublishComment();
  const queryClient = useQueryClient();

  const handlePublishComment = useCallback(() => {
    publishComment({
      id: id || "",
      wallet_address: address?.toLowerCase() || "",
      content: newComment,
    })
      .then(() => {
        setNewComment("");
        queryClient.invalidateQueries({ queryKey: ["comment", id] });
      })
      .catch(() => {
        toast.error("Failed to publish a comment");
      });
  }, [address, id, newComment, publishComment, queryClient]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-start gap-3">
          <Avatar name={address} className="w-10 h-10" />
          <div className="flex-1">
            <Textarea
              placeholder="What are your thoughts?"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px] text-sm resize-none border-gray-200 focus:border-gray-300 focus:ring-0 mb-3"
            />
            <div className="flex justify-end items-center">
              <Button
                onClick={handlePublishComment}
                size="sm"
                disabled={!newComment.trim() || isPending}
              >
                Publish
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Responses ({listComments?.length || 0})
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          What did you think of this story?
        </p>
      </div>

      <div>
        {(listComments || []).map((comment, index) => (
          <CommentItem key={index} comment={comment} />
        ))}
      </div>
    </div>
  );
}
