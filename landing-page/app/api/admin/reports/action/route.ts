import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { checkModeratorAccess } from "@/lib/admin-check";

export async function POST(request: Request) {
  try {
    // Verify moderator/admin access
    const { hasAccess, user } = await checkModeratorAccess();
    
    if (!user || !hasAccess) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reportId, action, targetType, targetId } = await request.json();

    if (!reportId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = await createClient();

    // Handle different actions
    switch (action) {
      case "dismiss": {
        // Mark report as reviewed/dismissed
        const { error } = await supabase
          .from("reports")
          .update({ 
            status: "dismissed",
            resolved_at: new Date().toISOString(),
            resolved_by: user.id
          })
          .eq("id", reportId);

        if (error) throw error;
        break;
      }

      case "delete": {
        // Delete the reported content based on type
        if (targetType === "game" && targetId) {
          await supabase.from("games").delete().eq("id", targetId);
        } else if (targetType === "comment" && targetId) {
          await supabase.from("comments").delete().eq("id", targetId);
        }

        // Mark report as resolved
        await supabase
          .from("reports")
          .update({ 
            status: "resolved",
            resolution: "content_deleted",
            resolved_at: new Date().toISOString(),
            resolved_by: user.id
          })
          .eq("id", reportId);
        break;
      }

      case "ban": {
        // Ban the user (update their profile)
        if (targetId) {
          await supabase
            .from("profiles")
            .update({ banned: true, banned_at: new Date().toISOString() })
            .eq("id", targetId);
        }

        // Mark report as resolved
        await supabase
          .from("reports")
          .update({ 
            status: "resolved",
            resolution: "user_banned",
            resolved_at: new Date().toISOString(),
            resolved_by: user.id
          })
          .eq("id", reportId);
        break;
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
