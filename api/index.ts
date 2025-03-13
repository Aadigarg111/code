import express from "express";
import { storage } from "../server/storage";
import { insertChallengeSchema, insertProgressSchema } from "@shared/schema";

const app = express();
app.use(express.json());

// GitHub OAuth routes (mock for now)
app.post("/auth/github", async (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ message: "GitHub code is required" });
  }

  try {
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

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to authenticate with GitHub" });
  }
});

// Challenge routes
app.post("/challenges", async (req, res) => {
  try {
    const challenge = insertChallengeSchema.parse(req.body);
    const newChallenge = await storage.createChallenge(challenge);
    res.json(newChallenge);
  } catch (error) {
    res.status(400).json({ message: "Invalid challenge data" });
  }
});

app.get("/challenges", async (req, res) => {
  const challenges = await storage.getActiveChallenges();
  res.json(challenges);
});

app.get("/challenges/:id", async (req, res) => {
  const challenge = await storage.getChallenge(parseInt(req.params.id));
  if (!challenge) {
    return res.status(404).json({ message: "Challenge not found" });
  }
  res.json(challenge);
});

// Progress routes
app.post("/progress", async (req, res) => {
  try {
    const progress = insertProgressSchema.parse(req.body);
    const newProgress = await storage.recordProgress(progress);
    res.json(newProgress);
  } catch (error) {
    res.status(400).json({ message: "Invalid progress data" });
  }
});

app.get("/progress/:challengeId/:userId", async (req, res) => {
  const { challengeId, userId } = req.params;
  const progress = await storage.getProgress(
    parseInt(challengeId),
    parseInt(userId)
  );
  res.json(progress);
});

export default app;
