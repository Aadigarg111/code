import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Zap, Award, Medal } from "lucide-react";
import type { UserStats } from "@shared/schema";
import { RANKS } from "@shared/schema";

interface UserLevelCardProps {
  stats: UserStats;
}

export function UserLevelCard({ stats }: UserLevelCardProps) {
  // Calculate XP progress to next level
  const totalXp = stats.totalXp ?? 0;

  const currentRank = Object.entries(RANKS).find(
    ([_, data]) => totalXp >= data.min
  )?.[1] || RANKS.NOVICE;

  const nextRank = Object.entries(RANKS).find(
    ([_, data]) => data.min > totalXp
  )?.[1];

  const progress = nextRank 
    ? ((totalXp - currentRank.min) / (nextRank.min - currentRank.min)) * 100
    : 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Level {stats.level ?? 1} {stats.title ?? "Rookie"}
        </CardTitle>
        <CardDescription>
          {stats.rank ?? "Novice"} • {totalXp} XP
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* XP Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{currentRank.title}</span>
              {nextRank && <span>{nextRank.title}</span>}
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground">
              {nextRank 
                ? `${nextRank.min - totalXp} XP needed for next rank`
                : "Maximum rank achieved!"}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex gap-2 items-center">
              <Star className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="font-medium">{stats.streak ?? 0} Days</p>
                <p className="text-muted-foreground">Current Streak</p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <Medal className="h-4 w-4 text-orange-500" />
              <div>
                <p className="font-medium">{stats.longestStreak ?? 0} Days</p>
                <p className="text-muted-foreground">Longest Streak</p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <Trophy className="h-4 w-4 text-purple-500" />
              <div>
                <p className="font-medium">{stats.challengesCompleted ?? 0}</p>
                <p className="text-muted-foreground">Challenges</p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <Zap className="h-4 w-4 text-blue-500" />
              <div>
                <p className="font-medium">{(stats.totalEarned ?? 0) / 1e18} ETH</p>
                <p className="text-muted-foreground">Total Earned</p>
              </div>
            </div>
          </div>

          {/* Badges */}
          {stats.badges && stats.badges.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Award className="h-4 w-4" />
                Badges
              </h4>
              <div className="flex flex-wrap gap-2">
                {stats.badges.map((badge, i) => (
                  <Badge key={i} variant="outline">
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}