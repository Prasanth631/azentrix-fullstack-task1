import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: parseInt(process.env.PORT || "5000", 10),
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: process.env.DATABASE_URL || "",
  DIRECT_URL: process.env.DIRECT_URL || "",
  JWT_SECRET: process.env.JWT_SECRET || "fallback-secret-change-me",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
};

// Validate required env vars
const requiredVars = ["DATABASE_URL", "JWT_SECRET"] as const;
for (const key of requiredVars) {
  if (!process.env[key]) {
    console.warn(`⚠️  Warning: ${key} is not set in environment variables`);
  }
}
