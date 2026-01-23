import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Heart, Play, GamepadIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface UserProfilePageProps {
  params: {
    username: string;
  };
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const supabase = await createClient();
  const { username } = params;

  // Fetch user profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, username, avatar_url, bio, created_at, subscription_tier")
    .eq("username", username)
    .single();

  if (profileError || !profile) {
    notFound();
  }

  // Fetch user's public games
  const { data: games } = await supabase
    .from("games")
    .select("*")
    .eq("user_id", profile.id)
    .eq("visibility", "public")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  // Calculate stats
  const totalGames = games?.length || 0;
  const totalPlays = games?.reduce((sum, game) => sum + (game.play_count || 0), 0) || 0;
  const totalLikes = games?.reduce((sum, game) => sum + (game.like_count || 0), 0) || 0;

  // Get current user to check if viewing own profile
  const { data: { user } } = await supabase.auth.getUser();
  const isOwnProfile = user?.id === profile.id;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/community"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Community
        </Link>

        {/* Profile Header */}
        <Card className="border-slate-800/70 bg-slate-950/40 mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white overflow-hidden">
                  {profile.avatar_url ? (
                    <Image
                      src={profile.avatar_url}
                      alt={profile.username}
                      width={96}
                      height={96}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    profile.username.charAt(0).toUpperCase()
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-white">{profile.username}</h1>
                  {profile.subscription_tier !== "free" && (
                    <Badge variant="default" className="capitalize">
                      {profile.subscription_tier}
                    </Badge>
                  )}
                </div>
                
                {profile.bio && (
                  <p className="text-slate-400 mb-3">{profile.bio}</p>
                )}

                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Joined {new Date(profile.created_at).toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
              </div>

              {/* Actions */}
              {isOwnProfile && (
                <div>
                  <Link href="/settings">
                    <Button variant="outline">Edit Profile</Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-slate-800/70 bg-slate-950/40">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <GamepadIcon className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{totalGames}</p>
                  <p className="text-sm text-slate-400">Games Created</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800/70 bg-slate-950/40">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-purple-500/10">
                  <Play className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{totalPlays.toLocaleString()}</p>
                  <p className="text-sm text-slate-400">Total Plays</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800/70 bg-slate-950/40">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-pink-500/10">
                  <Heart className="h-6 w-6 text-pink-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{totalLikes.toLocaleString()}</p>
                  <p className="text-sm text-slate-400">Total Likes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Games Grid */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            {isOwnProfile ? "Your" : `${profile.username}'s`} Games
          </h2>
          
          {games && games.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {games.map((game) => (
                <Card key={game.id} className="border-slate-800/70 bg-slate-950/40 hover:border-slate-700 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <CardTitle className="text-xl text-white line-clamp-2">
                        {game.title}
                      </CardTitle>
                      {game.language && (
                        <Badge variant="outline" className="shrink-0 text-xs">
                          {game.language === 'javascript' ? '⚡ JS' : '🐍 PY'}
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="line-clamp-2">
                      {game.description || "No description"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                      <span className="flex items-center gap-1">
                        <Play className="h-4 w-4" />
                        {game.play_count || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {game.like_count || 0}
                      </span>
                      {game.config?.story?.difficulty && (
                        <Badge variant="outline" className="capitalize text-xs">
                          {game.config.story.difficulty}
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/community/${profile.username}/${game.slug}`} className="flex-1">
                        <Button className="w-full" size="sm">
                          Play
                        </Button>
                      </Link>
                      {isOwnProfile && (
                        <Link href={`/lab?edit=${game.id}`}>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-slate-800/70 bg-slate-950/40">
              <CardContent className="py-12 text-center">
                <GamepadIcon className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 mb-4">
                  {isOwnProfile 
                    ? "You haven't published any games yet"
                    : `${profile.username} hasn't published any games yet`}
                </p>
                {isOwnProfile && (
                  <Link href="/lab">
                    <Button>Create Your First Game</Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
