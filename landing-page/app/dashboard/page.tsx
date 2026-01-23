"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Game, SubscriptionTier } from "@/lib/db-types";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GameCardActions } from "@/components/game-card-actions";
import { DashboardNav } from "@/components/dashboard-nav";
import { SUBSCRIPTION_LIMITS } from "@/lib/subscription-limits";
import { Sparkles, Zap, Rocket } from "lucide-react";

// Counter animation component
function AnimatedCounter({ value, duration = 1 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Handle zero value case
    if (value === 0) {
      setCount(0);
      return;
    }

    let start = 0;
    const end = value;
    const incrementTime = Math.max(10, (duration * 1000) / end); // Minimum 10ms interval
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count}</span>;
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function DashboardPage() {
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [profile, setProfile] = useState<{ username?: string; subscription_tier?: SubscriptionTier; games_created_this_month?: number } | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    const supabase = createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push("/auth/sign-in");
      return;
    }

    // Fetch user's games
    const { data: gamesData, error: gamesError } = await supabase
      .from("games")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (gamesError) {
      console.error("Error fetching games:", gamesError);
    }

    // Fetch user profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    console.log("Fetched games:", gamesData?.length || 0, gamesData);
    setGames(gamesData || []);
    setProfile(profileData);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleGameDeleted = () => {
    // Reload the games list after deletion
    loadData();
  };

  if (loading) {
    return (
      <>
        <DashboardNav />
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Loading...</p>
        </div>
      </>
    );
  }

  const subscriptionTier = (profile?.subscription_tier || "free") as SubscriptionTier;
  const gamesCreated = profile?.games_created_this_month || 0;
  const limits = SUBSCRIPTION_LIMITS[subscriptionTier];
  const gamesLimit = limits.gamesPerMonth === Infinity ? "Unlimited" : limits.gamesPerMonth;

  const getTierIcon = () => {
    switch (subscriptionTier) {
      case "free":
        return <Sparkles className="w-6 h-6 text-blue-400" />;
      case "pro":
        return <Zap className="w-6 h-6 text-purple-400" />;
      case "premium":
        return <Rocket className="w-6 h-6 text-yellow-400" />;
    }
  };

  return (
    <>
      <DashboardNav />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {profile?.username}!</p>
        </div>

      {/* Subscription Status */}
      <Card className="mb-8 border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-purple-600/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getTierIcon()}
              <div>
                <CardTitle className="capitalize">{limits.name} Plan</CardTitle>
                <CardDescription>
                  {gamesLimit === "Unlimited" 
                    ? `${gamesCreated} games created this month`
                    : `${gamesCreated} / ${gamesLimit} games this month`}
                </CardDescription>
              </div>
            </div>
            {subscriptionTier === "free" && (
              <Link href="/pricing">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  Upgrade Plan
                </Button>
              </Link>
            )}
          </div>
        </CardHeader>
        {subscriptionTier === "free" && gamesCreated >= limits.gamesPerMonth && (
          <CardContent>
            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-sm">
              You&apos;ve reached your monthly limit. Upgrade to Pro or Premium to create more games!
            </div>
          </CardContent>
        )}
      </Card>

      {/* Quick Actions */}
      <div className="mb-8 flex gap-4">
        <Link href="/lab">
          <Button size="lg">Create New Game</Button>
        </Link>
        <Link href="/community">
          <Button variant="outline" size="lg">
            Browse Community
          </Button>
        </Link>
      </div>

      {/* Games Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Your Games</h2>

        {games && games.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {games.map((game: Game) => (
              <motion.div 
                key={game.id}
                variants={fadeInUp}
                whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.2 } }}
              >
                <Card className="hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="line-clamp-1">{game.title}</CardTitle>
                      <CardDescription className="mt-1">{game.slug}</CardDescription>
                    </div>
                    <Badge
                      variant={
                        game.status === "published"
                          ? "success"
                          : "default"
                      }
                    >
                      {game.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {game.description || "No description"}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span>❤️ {game.like_count}</span>
                    <span>▶️ {game.play_count}</span>
                    <Badge variant="default">{game.visibility}</Badge>
                  </div>

                  <GameCardActions game={game} profileUsername={profile?.username} onDelete={handleGameDeleted} />
                </CardContent>
              </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">
              You haven&apos;t created any games yet.
            </p>
            <Link href="/lab">
              <Button>Create Your First Game</Button>
            </Link>
          </Card>
        )}
      </div>

      {/* Usage Analytics */}
      <Card className="border-slate-800/70 bg-slate-950/40 mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-400" />
            Usage Analytics
          </CardTitle>
          <CardDescription>
            Track your monthly usage and subscription benefits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Games Created This Month */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Games Created This Month</span>
              <Badge variant="default" className="capitalize">
                {profile?.subscription_tier || 'free'} Tier
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-2xl font-bold">
                <span>
                  {profile?.games_created_this_month || 0} / {
                    profile?.subscription_tier 
                      ? SUBSCRIPTION_LIMITS[profile.subscription_tier as SubscriptionTier].gamesPerMonth === Infinity 
                        ? '∞' 
                        : SUBSCRIPTION_LIMITS[profile.subscription_tier as SubscriptionTier].gamesPerMonth
                      : SUBSCRIPTION_LIMITS.free.gamesPerMonth
                  }
                </span>
                {profile?.subscription_tier && profile.games_created_this_month !== undefined && (
                  <span className={`text-sm ${
                    profile.games_created_this_month >= SUBSCRIPTION_LIMITS[profile.subscription_tier as SubscriptionTier].gamesPerMonth * 0.8
                      ? 'text-yellow-500'
                      : 'text-green-500'
                  }`}>
                    {SUBSCRIPTION_LIMITS[profile.subscription_tier as SubscriptionTier].gamesPerMonth === Infinity
                      ? '100%'
                      : `${Math.round((profile.games_created_this_month / SUBSCRIPTION_LIMITS[profile.subscription_tier as SubscriptionTier].gamesPerMonth) * 100)}%`
                    }
                  </span>
                )}
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${
                    profile?.subscription_tier && profile.games_created_this_month !== undefined && 
                    profile.games_created_this_month >= SUBSCRIPTION_LIMITS[profile.subscription_tier as SubscriptionTier].gamesPerMonth * 0.8
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{ 
                    width: `${
                      profile?.subscription_tier && profile.games_created_this_month !== undefined
                        ? SUBSCRIPTION_LIMITS[profile.subscription_tier as SubscriptionTier].gamesPerMonth === Infinity
                          ? 100
                          : Math.min((profile.games_created_this_month / SUBSCRIPTION_LIMITS[profile.subscription_tier as SubscriptionTier].gamesPerMonth) * 100, 100)
                        : 0
                    }%` 
                  }}
                />
              </div>
            </div>
          </div>

          {/* Subscription Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-400">Build Priority</span>
              </div>
              <p className="text-lg font-bold capitalize">
                {profile?.subscription_tier 
                  ? SUBSCRIPTION_LIMITS[profile.subscription_tier as SubscriptionTier].buildPriority
                  : 'standard'}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Rocket className="h-4 w-4 text-purple-400" />
                <span className="text-sm font-medium text-purple-400">Custom Sprites</span>
              </div>
              <p className="text-lg font-bold">
                {profile?.subscription_tier && SUBSCRIPTION_LIMITS[profile.subscription_tier as SubscriptionTier].customSprites
                  ? '✓ Enabled'
                  : '✗ Disabled'}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-green-400" />
                <span className="text-sm font-medium text-green-400">Total Storage</span>
              </div>
              <p className="text-lg font-bold">
                {(games?.reduce((sum, game) => sum + (game.bundle_size || 0), 0) / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>

          {/* Upgrade CTA */}
          {profile?.subscription_tier === 'free' && (
            <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold mb-1">Upgrade to Pro</p>
                  <p className="text-sm text-slate-400">
                    Create 20 games/month, custom sprites, priority builds
                  </p>
                </div>
                <Link href="/pricing">
                  <Button>Upgrade</Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}>
          <Card>
            <CardHeader>
              <CardTitle>Total Games</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">
                <AnimatedCounter value={games?.length || 0} />
              </p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={fadeInUp} whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}>
          <Card>
            <CardHeader>
              <CardTitle>Total Likes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">
                <AnimatedCounter value={games?.reduce((sum, game) => sum + (game.like_count || 0), 0) || 0} />
              </p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={fadeInUp} whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}>
          <Card>
            <CardHeader>
              <CardTitle>Total Plays</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">
                <AnimatedCounter value={games?.reduce((sum, game) => sum + (game.play_count || 0), 0) || 0} />
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
    </>
  );
}

