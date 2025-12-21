import express from "express";
import authRoutes from "./routes/auth.routes.js";

const app = express();
app.use(express.json());
const errorMiddleware = require('./middleware/error.middleware');
app.use(errorMiddleware);
app.use("/api/auth", authRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

export default app;
