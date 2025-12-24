import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  getTasksByProject,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from "../controllers/task.controller.js";

const router = express.Router();

// Project → Tasks
router.get("/projects/:projectId/tasks", authenticate, getTasksByProject);
router.post("/projects/:projectId/tasks", authenticate, createTask);

// Task actions
router.put("/tasks/:taskId", authenticate, updateTask);
router.patch("/tasks/:taskId/status", authenticate, updateTaskStatus);
router.delete("/tasks/:taskId", authenticate, deleteTask);

export default router;
