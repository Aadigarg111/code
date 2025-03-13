import express from "express";
import { z } from "zod";

const app = express();
app.use(express.json());

// API routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Export the Express API
export default app;