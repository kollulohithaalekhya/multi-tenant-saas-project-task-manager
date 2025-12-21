import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register-tenant", registerTenant);
router.post("/login", login);
router.get("/me", authenticate, getCurrentUser);

export default router;
