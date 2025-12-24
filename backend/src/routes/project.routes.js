import express from "express";
import {
  listProjects,
  createProject,
  updateProject,
  deleteProject,
  getProjectById
} from "../controllers/project.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * Project Management Routes
 */

// Create project
router.post("/", authenticate, createProject);

// List projects
router.get("/", authenticate, listProjects);

// Update project
router.put("/:projectId", authenticate, updateProject);

// Delete project
router.delete("/:projectId", authenticate, deleteProject);
// Get single project
router.get("/:projectId", authenticate, getProjectById);

export default router;
