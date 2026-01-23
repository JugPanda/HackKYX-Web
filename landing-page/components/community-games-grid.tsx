"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { Game } from "@/lib/db-types";

interface CommunityGamesGridProps {
  initialGames: Game[];
}

type SortOption = "newest" | "popular" | "trending" | "most-played";
type LanguageFilter = "all" | "javascript" | "python";
type DifficultyFilter = "all" | "rookie" | "veteran" | "nightmare";

export function CommunityGamesGrid({ initialGames }: CommunityGamesGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState<LanguageFilter>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showFilters, setShowFilters] = useState(false);

  const filteredAndSortedGames = useMemo(() => {
    let filtered = [...initialGames];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (game) =>
          game.title?.toLowerCase().includes(query) ||
          game.description?.toLowerCase().includes(query) ||
          (game.profiles as any)?.username?.toLowerCase().includes(query)
      );
    }

    // Language filter
    if (languageFilter !== "all") {
      filtered = filtered.filter((game) => game.language === languageFilter);
    }

    // Difficulty filter
    if (difficultyFilter !== "all") {
      filtered = filtered.filter((game) => {
        const difficulty = (game.config as any)?.story?.difficulty;
        return difficulty === difficultyFilter;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime();
        case "popular":
          return (b.like_count || 0) - (a.like_count || 0);
        case "trending":
          // Trending = likes + plays with recent bias
          const scoreA = (a.like_count || 0) * 2 + (a.play_count || 0);
          const scoreB = (b.like_count || 0) * 2 + (b.play_count || 0);
          return scoreB - scoreA;
        case "most-played":
          return (b.play_count || 0) - (a.play_count || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [initialGames, searchQuery, languageFilter, difficultyFilter, sortBy]);

  return (
    <div>
      {/* Search and Filters */}
      <Card className="border-slate-800/70 bg-slate-950/40 mb-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search games, creators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full md:w-auto"
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>

            {/* Filters Panel */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                {/* Sort By */}
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="newest">Newest</option>
                    <option value="trending">Trending</option>
                    <option value="popular">Most Liked</option>
                    <option value="most-played">Most Played</option>
                  </select>
                </div>

                {/* Language Filter */}
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Language
                  </label>
                  <select
                    value={languageFilter}
                    onChange={(e) => setLanguageFilter(e.target.value as LanguageFilter)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="all">All Languages</option>
                    <option value="javascript">⚡ JavaScript</option>
                    <option value="python">🐍 Python</option>
                  </select>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Difficulty
                  </label>
                  <select
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value as DifficultyFilter)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="all">All Difficulties</option>
                    <option value="rookie">Rookie</option>
                    <option value="veteran">Veteran</option>
                    <option value="nightmare">Nightmare</option>
                  </select>
                </div>
              </div>
            )}

            {/* Results Count */}
            <div className="text-sm text-slate-400">
              Showing {filteredAndSortedGames.length} of {initialGames.length} games
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedGames.length > 0 ? (
          filteredAndSortedGames.map((game: Game) => (
            <CardContainer key={game.id} className="w-full">
              <CardBody className="w-full">
                <Card className="border-slate-800/70 bg-slate-950/40 hover:border-slate-600/70 transition-all h-full flex flex-col">
                  <Link
                    href={`/community/${(game.profiles as any)?.username}/${game.slug}`}
                    className="flex-1"
                  >
                    <CardItem translateZ="50" className="w-full">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <CardTitle className="line-clamp-1 text-white">
                              {game.title}
                            </CardTitle>
                            <CardDescription className="mt-1 text-slate-400">
                              by {(game.profiles as any)?.username || "Anonymous"}
                            </CardDescription>
                          </div>
                          <div className="flex flex-col gap-1">
                            <Badge variant="default" className="bg-slate-700 text-slate-200 text-xs">
                              {(game.config as any)?.story?.difficulty || "veteran"}
                            </Badge>
                            {game.language && (
                              <Badge variant="outline" className="text-xs">
                                {game.language === "javascript" ? "⚡ JS" : "🐍 PY"}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                    </CardItem>
                    <CardItem translateZ="30" className="w-full">
                      <CardContent>
                        <p className="text-sm text-slate-400 line-clamp-2 mb-4">
                          {game.description ||
                            (game.config as any)?.story?.goal ||
                            "No description"}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span>❤️ {game.like_count || 0}</span>
                          <span>▶️ {game.play_count || 0}</span>
                        </div>
                      </CardContent>
                    </CardItem>
                  </Link>
                  <CardItem translateZ="80" className="w-full">
                    <CardContent className="pt-0">
                      <div className="flex gap-2">
                        <Link
                          href={`/community/${(game.profiles as any)?.username}/${game.slug}`}
                          className="flex-1"
                        >
                          <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                            🎮 Play
                          </Button>
                        </Link>
                        <Link href={`/lab?remix=${game.id}`} className="flex-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full border-slate-600 hover:bg-slate-800"
                          >
                            🔄 Remix
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </CardItem>
                </Card>
              </CardBody>
            </CardContainer>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-slate-400 mb-2">No games match your filters</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setLanguageFilter("all");
                setDifficultyFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
