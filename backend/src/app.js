import express from "express";
import cors from "cors";
import pool from "./config/db.js"; 
import authRoutes from "./routes/auth.routes.js";
import tenantRoutes from "./routes/tenant.routes.js";
import userRoutes from "./routes/user.routes.js";
import projectRoutes from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({
      status: "ok",
      database: "connected",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      database: "disconnected",
    });
  }
});



app.use("/api/auth", authRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api", taskRoutes);

app.use(errorHandler);

export default app;
