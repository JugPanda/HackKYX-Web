"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2 } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    username: string;
    avatar_url: string | null;
  } | null;
}

interface GameInteractionsProps {
  gameId: string;
  initialHasLiked: boolean;
  initialLikeCount: number;
  initialComments: Array<Comment>;
  isOwner: boolean;
  userId: string | null;
}

export function GameInteractions({
  gameId,
  initialHasLiked,
  initialLikeCount,
  initialComments,
  isOwner,
  userId,
}: GameInteractionsProps) {
  const router = useRouter();
  const [hasLiked, setHasLiked] = useState(initialHasLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isTogglingLike, setIsTogglingLike] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const handleLike = async () => {
    if (!userId || isOwner) return;

    // Optimistic update
    const previousLiked = hasLiked;
    const previousCount = likeCount;
    setHasLiked(!hasLiked);
    setLikeCount(hasLiked ? likeCount - 1 : likeCount + 1);
    setIsTogglingLike(true);

    try {
      const response = await fetch("/api/games/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to toggle like");
      }

      const { liked } = await response.json();
      setHasLiked(liked);
      // Refresh to get accurate count from server
      router.refresh();
    } catch (error) {
      // Rollback on error
      setHasLiked(previousLiked);
      setLikeCount(previousCount);
      console.error("Error toggling like:", error);
      alert(error instanceof Error ? error.message : "Failed to toggle like");
    } finally {
      setIsTogglingLike(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (!userId || isOwner || !commentText.trim()) return;

    // Optimistic update
    const optimisticComment: Comment = {
      id: `temp-${Date.now()}`,
      content: commentText.trim(),
      created_at: new Date().toISOString(),
      user_id: userId,
      profiles: {
        username: "You",
        avatar_url: null,
      },
    };
    
    setComments(prev => [optimisticComment, ...prev]);
    const previousText = commentText;
    setCommentText("");
    setIsSubmittingComment(true);

    try {
      const response = await fetch("/api/comments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId,
          content: previousText.trim(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to post comment");
      }
      
      // Refresh to get the real comment from server
      router.refresh();
    } catch (error) {
      // Rollback on error
      setComments(prev => prev.filter(c => c.id !== optimisticComment.id));
      setCommentText(previousText);
      console.error("Error posting comment:", error);
      alert(error instanceof Error ? error.message : "Failed to post comment");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleEditComment = (commentId: string, content: string) => {
    setEditingCommentId(commentId);
    setEditText(content);
  };

  const handleUpdateComment = async (commentId: string) => {
    if (!editText.trim()) return;

    // Optimistic update
    const previousComments = [...comments];
    setComments(prev => prev.map(c => 
      c.id === commentId ? { ...c, content: editText.trim() } : c
    ));
    setEditingCommentId(null);

    try {
      const response = await fetch("/api/comments/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commentId,
          content: editText.trim(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update comment");
      }

      router.refresh();
    } catch (error) {
      // Rollback on error
      setComments(previousComments);
      setEditingCommentId(commentId);
      console.error("Error updating comment:", error);
      alert(error instanceof Error ? error.message : "Failed to update comment");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    // Optimistic update
    const previousComments = [...comments];
    setComments(prev => prev.filter(c => c.id !== commentId));

    try {
      const response = await fetch("/api/comments/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete comment");
      }

      router.refresh();
    } catch (error) {
      // Rollback on error
      setComments(previousComments);
      console.error("Error deleting comment:", error);
      alert(error instanceof Error ? error.message : "Failed to delete comment");
    }
  };

  return (
    <>
      {/* Like Button */}
      {userId && !isOwner && (
        <div className="flex gap-2 mb-8 items-center">
          <Button
            variant={hasLiked ? "default" : "outline"}
            onClick={handleLike}
            disabled={isTogglingLike}
          >
            {hasLiked ? "❤️ Liked" : "🤍 Like"}
          </Button>
          <span className="text-sm text-muted-foreground">
            {likeCount} {likeCount === 1 ? 'like' : 'likes'}
          </span>
        </div>
      )}

      {/* Comments Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Comments ({comments.length})</h2>
        
        {userId && !isOwner && (
          <Card className="p-4">
            <Textarea
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full p-2 border rounded resize-none"
              rows={3}
              maxLength={1000}
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-muted-foreground">
                {commentText.length}/1000
              </span>
              <Button 
                onClick={handleCommentSubmit}
                disabled={isSubmittingComment || !commentText.trim()}
              >
                {isSubmittingComment ? "Posting..." : "Post Comment"}
              </Button>
            </div>
          </Card>
        )}

        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <Card key={comment.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          {comment.profiles?.username || "Anonymous"}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {/* Edit/Delete buttons */}
                      {userId && comment.user_id === userId && (
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditComment(comment.id, comment.content)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    {editingCommentId === comment.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full"
                          rows={3}
                          maxLength={1000}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleUpdateComment(comment.id)}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingCommentId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </>
  );
}
