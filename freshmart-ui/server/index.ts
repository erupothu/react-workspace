import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { testAPIConnection, getMockProducts, getMockDashboardStats } from "./routes/test-api";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // FreshMart API test routes (will be replaced with actual Spring Boot integration)
  app.get("/api/test-connection", testAPIConnection);
  app.get("/api/products", getMockProducts);
  app.get("/api/dashboard/stats", getMockDashboardStats);

  return app;
}
