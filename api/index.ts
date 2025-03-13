import express from "express";
import { z } from "zod";

const app = express();
app.use(express.json());

// Type definitions (moved from shared/schema.ts to be self-contained)
const insertChallengeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  platform: z.string(),
  stakingAmount: z.number().min(0.001).max(100),
  durationDays: z.number().int().min(1).max(365),
  startDate: z.string(),
  creatorId: z.number()
});

// In-memory storage for serverless functions
const challenges = new Map();
let nextId = 1;

// Challenge routes
app.post("/challenges", async (req, res) => {
  try {
    const challenge = insertChallengeSchema.parse(req.body);
    const newChallenge = { 
      ...challenge, 
      id: nextId++,
      isActive: true 
    };
    challenges.set(newChallenge.id, newChallenge);
    res.json(newChallenge);
  } catch (error) {
    res.status(400).json({ message: "Invalid challenge data" });
  }
});

app.get("/challenges", async (_req, res) => {
  const activeChallenges = Array.from(challenges.values())
    .filter(challenge => challenge.isActive);
  res.json(activeChallenges);
});

app.get("/challenges/:id", async (req, res) => {
  const challenge = challenges.get(parseInt(req.params.id));
  if (!challenge) {
    return res.status(404).json({ message: "Challenge not found" });
  }
  res.json(challenge);
});

// Mock auth endpoint for development
app.post("/auth/github", async (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ message: "GitHub code is required" });
  }

  try {
    const mockUser = {
      id: 1,
      username: "demo_user",
      githubId: "123456",
      githubUsername: "demo_user",
      avatarUrl: "https://github.com/ghost.png",
      walletAddress: null
    };
    res.json(mockUser);
  } catch (error) {
    res.status(500).json({ message: "Failed to authenticate with GitHub" });
  }
});

export default app;