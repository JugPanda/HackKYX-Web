"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface ReportActionsProps {
  reportId: string;
  targetType: "user" | "game" | "comment";
  targetId: string | null;
}

export function ReportActions({ reportId, targetType, targetId }: ReportActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleAction = async (action: "dismiss" | "delete" | "ban") => {
    // Confirm destructive actions
    if (action === "delete") {
      if (!confirm(`Are you sure you want to delete this ${targetType}? This cannot be undone.`)) {
        return;
      }
    }
    if (action === "ban") {
      if (!confirm("Are you sure you want to ban this user?")) {
        return;
      }
    }

    setIsLoading(action);
    
    try {
      const response = await fetch("/api/admin/reports/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportId,
          action,
          targetType,
          targetId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.message || "Action failed");
        return;
      }

      // Refresh the page to show updated status
      router.refresh();
    } catch {
      alert("An error occurred");
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="flex gap-2">
      {/* Dismiss - just marks as reviewed */}
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleAction("dismiss")}
        disabled={isLoading !== null}
      >
        {isLoading === "dismiss" ? "..." : "✓ Dismiss"}
      </Button>

      {/* Delete content */}
      <Button
        size="sm"
        variant="default"
        className="bg-red-600 hover:bg-red-700 text-white"
        onClick={() => handleAction("delete")}
        disabled={isLoading !== null || !targetId}
      >
        {isLoading === "delete" ? "..." : "🗑️ Delete Content"}
      </Button>

      {/* Ban user (only for user reports) */}
      {targetType === "user" && targetId && (
        <Button
          size="sm"
          variant="default"
          className="bg-red-800 hover:bg-red-900 text-white"
          onClick={() => handleAction("ban")}
          disabled={isLoading !== null}
        >
          {isLoading === "ban" ? "..." : "🚫 Ban User"}
        </Button>
      )}
    </div>
  );
}
