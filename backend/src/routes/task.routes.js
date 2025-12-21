import express from "express";
import {
  createTask,
  listTasks,
  updateTask,
  updateTaskStatus
} from "../controllers/task.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * Task Management Routes
 */

router.post("/projects/:projectId/tasks", authenticate, createTask);
router.get("/projects/:projectId/tasks", authenticate, listTasks);
router.put("/tasks/:taskId", authenticate, updateTask);
router.patch("/tasks/:taskId/status", authenticate, updateTaskStatus);

export default router;
