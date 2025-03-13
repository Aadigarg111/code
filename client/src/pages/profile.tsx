import { useQuery } from "@tanstack/react-query";
import type { User, UserStats } from "@shared/schema";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserLevelCard } from "@/components/user-level-card";
import { Shield, CreditCard, Zap } from "lucide-react";

export default function Profile() {
  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ["/api/auth/me"]
  });

  const { data: stats, isLoading: statsLoading } = useQuery<UserStats>({
    queryKey: ["/api/users/stats"],
    enabled: !!user
  });

  if (userLoading || statsLoading) {
    return <Skeleton className="w-full h-[400px]" />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* User Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.avatarUrl || undefined} />
              <AvatarFallback>{user?.username?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{user?.username}</h2>
              <p className="text-sm text-muted-foreground">GitHub: {user?.githubUsername}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Wallet
            </h3>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="text-sm truncate flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                {user?.walletAddress || "No wallet connected"}
              </div>
              <Button variant="outline" size="sm">
                {user?.walletAddress ? "Disconnect" : "Connect Wallet"}
              </Button>
            </div>
          </div>

          {/* Subscription Status */}
          {stats && (
            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Subscription
              </h3>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium capitalize">{stats.subscriptionTier} Plan</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.subscriptionTier === "basic" 
                      ? "Upgrade to unlock premium features"
                      : "Premium features unlocked"}
                  </p>
                </div>
                <Button 
                  className="bg-primary"
                  onClick={() => alert("Subscription management coming soon!")}
                >
                  {stats.subscriptionTier === "basic" ? "Upgrade" : "Manage"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Level and Achievements */}
      {stats && <UserLevelCard stats={stats} />}
    </div>
  );
}