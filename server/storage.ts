import { users, challenges, progress } from "@shared/schema";
import type { User, InsertUser, Challenge, InsertChallenge, Progress, InsertProgress } from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByGithubId(githubId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User>;

  // Challenge operations
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;
  getChallenge(id: number): Promise<Challenge | undefined>;
  getUserChallenges(userId: number): Promise<Challenge[]>;
  getActiveChallenges(): Promise<Challenge[]>;

  // Progress operations
  recordProgress(progress: InsertProgress): Promise<Progress>;
  getProgress(challengeId: number, userId: number): Promise<Progress[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private challenges: Map<number, Challenge>;
  private progress: Map<number, Progress>;
  private currentIds: { users: number; challenges: number; progress: number };

  constructor() {
    this.users = new Map();
    this.challenges = new Map();
    this.progress = new Map();
    this.currentIds = { users: 1, challenges: 1, progress: 1 };
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByGithubId(githubId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.githubId === githubId);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentIds.users++;
    const newUser = { ...user, id } as User;
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const user = await this.getUser(id);
    if (!user) throw new Error("User not found");
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async createChallenge(challenge: InsertChallenge): Promise<Challenge> {
    const id = this.currentIds.challenges++;
    const newChallenge = { ...challenge, id, isActive: true } as Challenge;
    this.challenges.set(id, newChallenge);
    return newChallenge;
  }

  async getChallenge(id: number): Promise<Challenge | undefined> {
    return this.challenges.get(id);
  }

  async getUserChallenges(userId: number): Promise<Challenge[]> {
    return Array.from(this.challenges.values()).filter(
      challenge => challenge.creatorId === userId
    );
  }

  async getActiveChallenges(): Promise<Challenge[]> {
    return Array.from(this.challenges.values()).filter(
      challenge => challenge.isActive
    );
  }

  async recordProgress(progressData: InsertProgress): Promise<Progress> {
    const id = this.currentIds.progress++;
    const newProgress = { ...progressData, id } as Progress;
    this.progress.set(id, newProgress);
    return newProgress;
  }

  async getProgress(challengeId: number, userId: number): Promise<Progress[]> {
    return Array.from(this.progress.values()).filter(
      p => p.challengeId === challengeId && p.userId === userId
    );
  }
}

export const storage = new MemStorage();
