import express from "express";
import {
  getTenantDetails,
  updateTenant,
  listTenants,
} from "../controllers/tenant.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

/**
 * API 5: Get tenant details
 */
router.get("/:tenantId", authenticate, getTenantDetails);

/**
 * API 6: Update tenant
 */
router.put("/:tenantId", authenticate, updateTenant);

/**
 * API 7: List all tenants (super_admin only)
 */
router.get("/", authenticate, authorizeRoles("super_admin"), listTenants);

export default router;
