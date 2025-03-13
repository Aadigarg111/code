import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";

export default function Header() {
  const { data: user } = useQuery<User>({ 
    queryKey: ["/api/auth/me"],
    enabled: false // Only enable after auth is implemented
  });

  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-center">
        <div className="flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">CODESTAKE</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/dashboard">
              <span className="hover:text-primary transition-colors duration-200">Dashboard</span>
            </Link>
            <Link href="/create-challenge">
              <span className="hover:text-primary transition-colors duration-200">Create Challenge</span>
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {user ? (
            <div className="flex items-center space-x-4">
              <Link href="/profile">
                <Avatar>
                  <AvatarImage src={user.avatarUrl} />
                  <AvatarFallback>{user.username[0]}</AvatarFallback>
                </Avatar>
              </Link>
            </div>
          ) : (
            <Button
              variant="ghost"
              className="rounded-full hover:rounded-lg transition-all duration-300"
              onClick={() => {
                // Implement GitHub OAuth login
              }}
            >
              Sign in with GitHub
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}