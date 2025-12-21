import { Router } from "express";
import {
  registerTenant,
  login,
  getCurrentUser,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register-tenant", registerTenant);
router.post("/login", login);
router.get("/me", authenticate, getCurrentUser);

export default router;
