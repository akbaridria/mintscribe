import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Avatar from "boring-avatars";

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
    username: string;
  };
  content: string;
  timestamp: string;
}

const mockComments: Comment[] = [
  {
    id: "1",
    author: {
      name: "Sarah Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      username: "sarahchen",
    },
    content:
      "This is exactly what I needed to read today. The insights about building sustainable habits really resonated with me, especially the part about starting small and being consistent.",
    timestamp: "2 days ago",
  },
  {
    id: "2",
    author: {
      name: "Marcus Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      username: "marcusj",
    },
    content:
      "Great article! I particularly appreciated the research you cited about habit formation. It would be interesting to see a follow-up piece about breaking bad habits using similar principles.",
    timestamp: "3 days ago",
  },
  {
    id: "3",
    author: {
      name: "Elena Vasquez",
      avatar: "/placeholder.svg?height=40&width=40",
      username: "elenavasquez",
    },
    content:
      "I've been struggling with consistency for years, and your framework finally gave me a clear path forward. Thank you for sharing your experience and making it so actionable.",
    timestamp: "4 days ago",
  },
  {
    id: "4",
    author: {
      name: "David Kim",
      avatar: "/placeholder.svg?height=40&width=40",
      username: "davidkim",
    },
    content:
      "The habit stacking technique mentioned in this article has been surprisingly effective for me. Thanks for the practical advice!",
    timestamp: "5 days ago",
  },
  {
    id: "5",
    author: {
      name: "Alex Rivera",
      avatar: "/placeholder.svg?height=40&width=40",
      username: "alexrivera",
    },
    content:
      "I've been trying to implement the 2-minute rule and it's been a game changer. Simple but powerful concept.",
    timestamp: "1 week ago",
  },
];

function CommentItem({ comment }: { comment: Comment }) {
  return (
    <div className="py-6 border-b border-gray-100 last:border-b-0">
      <div className="flex items-start gap-3">
        <Avatar className="w-10 h-10" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-sm text-gray-900">
              {comment.author.name}
            </span>
            <span className="text-xs text-gray-500">
              @{comment.author.username}
            </span>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-500">{comment.timestamp}</span>
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
  const [comments, setComments] = useState<Comment[]>(mockComments);

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: {
          name: "You",
          avatar: "/placeholder.svg?height=40&width=40",
          username: "you",
        },
        content: newComment,
        timestamp: "now",
      };
      setComments([comment, ...comments]);
      setNewComment("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-start gap-3">
          <Avatar className="w-10 h-10" />
          <div className="flex-1">
            <Textarea
              placeholder="What are your thoughts?"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px] text-sm resize-none border-gray-200 focus:border-gray-300 focus:ring-0 mb-3"
            />
            <div className="flex justify-end items-center">
              <Button
                onClick={handleSubmitComment}
                size="sm"
                disabled={!newComment.trim()}
              >
                Publish
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Responses ({comments.length})
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          What did you think of this story?
        </p>
      </div>

      <div>
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
