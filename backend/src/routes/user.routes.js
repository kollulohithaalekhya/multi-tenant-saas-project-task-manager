import express from "express";
import {
  addUser,
  listUsers,
  updateUser,
  deleteUser
} from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

/**
 * User Management Routes
 */

// Add user to tenant (tenant_admin only)
router.post(
  "/tenants/:tenantId/users",
  authenticate,
  authorizeRoles("tenant_admin"),
  addUser
);

// List users in a tenant
router.get(
  "/tenants/:tenantId/users",
  authenticate,
  listUsers
);

// Update user
router.put(
  "/users/:userId",
  authenticate,
  updateUser
);

// Delete user (tenant_admin only)
router.delete(
  "/users/:userId",
  authenticate,
  authorizeRoles("tenant_admin"),
  deleteUser
);

export default router;
