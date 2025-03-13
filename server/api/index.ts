import express from "express";
import { registerRoutes } from "../routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize routes
const router = express.Router();
registerRoutes(router);

// Add API routes to app
app.use('/api', router);

export default app;
