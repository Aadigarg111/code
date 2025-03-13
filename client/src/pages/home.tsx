import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CheckCircle2, Sparkles } from "lucide-react";

function FeatureCheck({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <CheckCircle2 className="h-5 w-5 text-primary" />
      <span>{children}</span>
    </div>
  );
}

export default function Home() {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Stake Your Code.<br />
            Level Up Your Career.
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
            Join a community of developers who bet on themselves. Create coding challenges,
            stake crypto, and earn rewards for consistent progress.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="bg-primary">
            <Link href="/create-challenge">Create Challenge</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/dashboard">View Challenges</Link>
          </Button>
        </div>
      </div>

      {/* Subscription Tiers */}
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-center">Choose Your Plan</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Basic Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Basic</CardTitle>
              <p className="text-2xl font-bold">Free</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <FeatureCheck>Join & Create Challenges</FeatureCheck>
              <FeatureCheck>Earn XP & Badges</FeatureCheck>
              <FeatureCheck>Standard Payouts</FeatureCheck>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/dashboard">Start Now</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Plan */}
          <Card className="border-primary relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
              <Sparkles className="h-4 w-4" />
              Most Popular
            </div>
            <CardHeader>
              <CardTitle>Pro</CardTitle>
              <p className="text-2xl font-bold">$9.99/month</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <FeatureCheck>Everything in Basic</FeatureCheck>
              <FeatureCheck>Streak Protection</FeatureCheck>
              <FeatureCheck>Deadline Extensions</FeatureCheck>
              <FeatureCheck>Custom Themes</FeatureCheck>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-primary" onClick={() => alert("Pro subscription coming soon!")}>
                Buy Now
              </Button>
            </CardFooter>
          </Card>

          {/* Elite Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Elite</CardTitle>
              <p className="text-2xl font-bold">$19.99/month</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <FeatureCheck>Everything in Pro</FeatureCheck>
              <FeatureCheck>5-10% Extra Payouts</FeatureCheck>
              <FeatureCheck>Early Access Features</FeatureCheck>
              <FeatureCheck>AI-Based Insights</FeatureCheck>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => alert("Elite subscription coming soon!")}>
                Buy Now
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}