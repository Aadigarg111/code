import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertChallengeSchema, insertProgressSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // GitHub OAuth routes (mock for now)
  app.post("/api/auth/github", async (req, res) => {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: "GitHub code is required" });
    }

    try {
      // Mock GitHub user data
      const mockGithubUser = {
        id: "123456",
        login: "mockuser",
        avatar_url: "https://github.com/ghost.png"
      };

      let user = await storage.getUserByGithubId(mockGithubUser.id);
      
      if (!user) {
        user = await storage.createUser({
          username: mockGithubUser.login,
          githubId: mockGithubUser.id,
          githubUsername: mockGithubUser.login,
          avatarUrl: mockGithubUser.avatar_url,
          walletAddress: null,
          githubAccessToken: "mock_token"
        });
      }

      req.session.userId = user.id;
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to authenticate with GitHub" });
    }
  });

  // Challenge routes
  app.post("/api/challenges", async (req, res) => {
    try {
      const challenge = insertChallengeSchema.parse(req.body);
      const newChallenge = await storage.createChallenge(challenge);
      res.json(newChallenge);
    } catch (error) {
      res.status(400).json({ message: "Invalid challenge data" });
    }
  });

  app.get("/api/challenges", async (req, res) => {
    const challenges = await storage.getActiveChallenges();
    res.json(challenges);
  });

  app.get("/api/challenges/:id", async (req, res) => {
    const challenge = await storage.getChallenge(parseInt(req.params.id));
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }
    res.json(challenge);
  });

  // Progress routes
  app.post("/api/progress", async (req, res) => {
    try {
      const progress = insertProgressSchema.parse(req.body);
      const newProgress = await storage.recordProgress(progress);
      res.json(newProgress);
    } catch (error) {
      res.status(400).json({ message: "Invalid progress data" });
    }
  });

  app.get("/api/progress/:challengeId/:userId", async (req, res) => {
    const { challengeId, userId } = req.params;
    const progress = await storage.getProgress(
      parseInt(challengeId),
      parseInt(userId)
    );
    res.json(progress);
  });

  const httpServer = createServer(app);
  return httpServer;
}
