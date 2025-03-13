import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertChallengeSchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import type { InsertChallenge } from "@shared/schema";
import { useLocation } from "wouter";

export default function CreateChallenge() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const form = useForm<InsertChallenge>({
    resolver: zodResolver(insertChallengeSchema),
    defaultValues: {
      title: "",
      description: "",
      platform: "github",
      stakingAmount: 0.1, // Default 0.1 ETH
      durationDays: 30,
      startDate: new Date(),
      creatorId: 1 // TODO: Get from auth
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertChallenge) => {
      const res = await apiRequest("POST", "/api/challenges", {
        ...data,
        startDate: data.startDate.toISOString()
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Challenge Created",
        description: "Your coding challenge has been created successfully!"
      });
      setLocation("/dashboard");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create challenge",
        variant: "destructive"
      });
    }
  });

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create a Coding Challenge</CardTitle>
        <CardDescription>
          Set up your challenge parameters and stake amount
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Challenge Title</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="rounded-lg hover:rounded-xl transition-all duration-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="rounded-lg hover:rounded-xl transition-all duration-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-lg hover:rounded-xl transition-all duration-300">
                        <SelectValue placeholder="Select a platform" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="github">GitHub</SelectItem>
                      <SelectItem value="leetcode">LeetCode</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stakingAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stake Amount (ETH)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.001"
                      min="0.001"
                      max="100"
                      className="rounded-lg hover:rounded-xl transition-all duration-300"
                      {...field}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (!isNaN(value)) {
                          field.onChange(value);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="durationDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (Days)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      min="1"
                      max="365"
                      className="rounded-lg hover:rounded-xl transition-all duration-300"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit"
              className="w-full rounded-lg hover:rounded-xl transition-all duration-300 bg-primary"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Challenge...
                </>
              ) : (
                "Create Challenge"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}