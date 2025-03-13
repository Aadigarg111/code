import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  githubId: text("github_id").unique(),
  githubUsername: text("github_username"),
  githubAccessToken: text("github_access_token"),
  walletAddress: text("wallet_address"),
  avatarUrl: text("avatar_url")
});

export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  creatorId: integer("creator_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  platform: text("platform").notNull(), // github, leetcode
  stakingAmount: integer("staking_amount").notNull(),
  durationDays: integer("duration_days").notNull(),
  startDate: timestamp("start_date").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  rewardMultiplier: integer("reward_multiplier").default(100), // Base 100 = 1x, 110 = 1.1x
  chainId: integer("chain_id").default(1), // 1 for Ethereum Mainnet
  contractAddress: text("contract_address") // Smart contract address
});

export const progress = pgTable("progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  challengeId: integer("challenge_id").notNull(),
  date: timestamp("date").notNull(),
  commitCount: integer("commit_count").notNull().default(0),
  problemsSolved: integer("problems_solved").notNull().default(0),
  xpEarned: integer("xp_earned").default(0)
});

export const userStats = pgTable("user_stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  totalXp: integer("total_xp").default(0),
  level: integer("level").default(1),
  streak: integer("streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  challengesCompleted: integer("challenges_completed").default(0),
  totalEarned: integer("total_earned").default(0), // In wei
  rank: text("rank").default("Novice"), // Novice, Apprentice, Expert, Master, Legend
  badges: text("badges").array().default([]), // Array of earned badges
  achievements: text("achievements").array().default([]), // Array of completed achievements
  title: text("title").default("Rookie Coder"), // Custom titles earned
  preferredChain: integer("preferred_chain").default(1), // Default to Ethereum
  subscriptionTier: text("subscription_tier").default("basic") // basic, pro, elite
});

// Enhanced validation schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  githubAccessToken: true
});

export const insertChallengeSchema = createInsertSchema(challenges)
  .omit({ 
    id: true,
    isActive: true,
    contractAddress: true 
  })
  .extend({
    stakingAmount: z.number().min(0.001).max(100),
    durationDays: z.number().int().min(1).max(365)
  });

export const insertProgressSchema = createInsertSchema(progress).omit({
  id: true
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Challenge = typeof challenges.$inferSelect;
export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
export type Progress = typeof progress.$inferSelect;
export type InsertProgress = z.infer<typeof insertProgressSchema>;
export type UserStats = typeof userStats.$inferSelect;

// XP and Level constants
export const XP_LEVELS = {
  COMMIT: 10,
  PROBLEM_SOLVED: 20,
  CHALLENGE_COMPLETED: 100,
  STREAK_BONUS: 5,
  ACHIEVEMENT_UNLOCKED: 50
};

export const RANKS = {
  NOVICE: { min: 0, title: "Novice" },
  APPRENTICE: { min: 1000, title: "Apprentice" },
  EXPERT: { min: 5000, title: "Expert" },
  MASTER: { min: 10000, title: "Master" },
  LEGEND: { min: 25000, title: "Legend" }
};