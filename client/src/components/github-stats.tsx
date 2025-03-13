import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export function GitHubStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/github/stats"],
    enabled: false // Enable after GitHub integration
  });

  if (isLoading) {
    return <Skeleton className="w-full h-[200px]" />;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold">23</div>
          <div className="text-sm text-muted-foreground">Commits Today</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold">156</div>
          <div className="text-sm text-muted-foreground">Weekly Streak</div>
        </Card>
      </div>
    </div>
  );
}
