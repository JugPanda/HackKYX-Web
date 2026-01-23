import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { sanitizeText } from "@/lib/content-filter";
import { z } from "zod";

const updateCommentSchema = z.object({
  commentId: z.string().uuid(),
  content: z.string().min(1).max(1000),
});

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = updateCommentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    const { commentId, content } = validation.data;

    // Verify comment ownership
    const { data: comment, error: fetchError } = await supabase
      .from("comments")
      .select("user_id")
      .eq("id", commentId)
      .single();

    if (fetchError || !comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    if (comment.user_id !== user.id) {
      return NextResponse.json(
        { error: "You can only edit your own comments" },
        { status: 403 }
      );
    }

    // Update comment
    const { error: updateError } = await supabase
      .from("comments")
      .update({
        content: sanitizeText(content, 1000),
        updated_at: new Date().toISOString(),
      })
      .eq("id", commentId);

    if (updateError) {
      console.error("Error updating comment:", updateError);
      return NextResponse.json(
        { error: "Failed to update comment" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in update comment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
