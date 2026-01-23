import { createClient } from "@/lib/supabase/server";
import { DashboardNav } from "@/components/dashboard-nav";
import { CommunityGamesGrid } from "@/components/community-games-grid";

export default async function CommunityPage() {
  const supabase = await createClient();

  // Fetch published games (only show games that are published and have bundle_url)
  // Fetch more games for better filtering experience
  const { data: games } = await supabase
    .from("games")
    .select("*")
    .eq("visibility", "public")
    .eq("status", "published")
    .not("bundle_url", "is", null)
    .order("published_at", { ascending: false })
    .limit(100);

  // Enrich with profile data
  if (games && games.length > 0) {
    const userIds = [...new Set(games.map(g => g.user_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, username, avatar_url")
      .in("id", userIds);
    
    const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
    games.forEach(game => {
      const profile = profileMap.get(game.user_id);
      game.profiles = profile ? { username: profile.username, avatar_url: profile.avatar_url || null } : undefined;
    });
  }

  return (
    <>
      <DashboardNav />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Community Games</h1>
          <p className="text-muted-foreground">
            Explore games created by the JG Engine community
          </p>
        </div>

        <CommunityGamesGrid initialGames={games || []} />
    </div>
    </>
  );
}

