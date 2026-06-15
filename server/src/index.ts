import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import routes from "./routes";

const app = express();

// Middleware
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Budget Tracker API is running",
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// API Routes
app.use("/api", routes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use(errorHandler);

// Start server
app.listen(env.PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║   💰 Budget Tracker API Server          ║
  ║   Running on port ${env.PORT}                 ║
  ║   Environment: ${env.NODE_ENV.padEnd(20)}   ║
  ╚══════════════════════════════════════════╝
  `);
});

export default app;
