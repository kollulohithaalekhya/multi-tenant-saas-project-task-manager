import pool from "../config/db.js";
import bcrypt from "bcrypt";

/* =========================
   ADD USER
========================= */
export const addUser = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const { email, full_name, password, role, is_active = true } = req.body;

    if (!email || !full_name || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // check user limit
    const tenantRes = await pool.query(
      "SELECT max_users FROM tenants WHERE id=$1",
      [tenantId]
    );

    const countRes = await pool.query(
      "SELECT COUNT(*) FROM users WHERE tenant_id=$1",
      [tenantId]
    );

    if (+countRes.rows[0].count >= tenantRes.rows[0].max_users) {
      return res.status(403).json({
        success: false,
        message: "User limit exceeded",
      });
    }

    // unique email per tenant
    const exists = await pool.query(
      "SELECT id FROM users WHERE email=$1 AND tenant_id=$2",
      [email, tenantId]
    );

    if (exists.rowCount) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO users
      (id, tenant_id, email, password_hash, full_name, role, is_active, created_at, updated_at)
      VALUES
      (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING id, email, full_name, role, is_active, created_at
      `,
      [tenantId, email, password_hash, full_name, role, is_active]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("ADD USER ERROR:", err);
    res.status(500).json({ success: false, message: "Failed to add user" });
  }
};

/* =========================
   LIST USERS
========================= */
export const listUsers = async (req, res) => {
  const tenantId = req.user.tenantId;

  const result = await pool.query(
    `
    SELECT id, email, full_name, role, is_active, created_at
    FROM users
    WHERE tenant_id=$1
    ORDER BY created_at ASC
    `,
    [tenantId]
  );

  res.json({ success: true, data: { users: result.rows } });
};

/* =========================
   UPDATE USER
========================= */
export const updateUser = async (req, res) => {
  const tenantId = req.user.tenantId;
  const { userId } = req.params;
  const { full_name, role, is_active } = req.body;

  const result = await pool.query(
    `
    UPDATE users
    SET full_name=$1, role=$2, is_active=$3, updated_at=NOW()
    WHERE id=$4 AND tenant_id=$5
    RETURNING id, email, full_name, role, is_active
    `,
    [full_name, role, is_active, userId, tenantId]
  );

  if (!result.rowCount) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.json({ success: true, data: result.rows[0] });
};

/* =========================
   DELETE USER
========================= */
export const deleteUser = async (req, res) => {
  const tenantId = req.user.tenantId;
  const currentUserId = req.user.userId;
  const { userId } = req.params;

  if (userId === currentUserId) {
    return res.status(403).json({
      success: false,
      message: "Cannot delete yourself",
    });
  }

  const result = await pool.query(
    "DELETE FROM users WHERE id=$1 AND tenant_id=$2",
    [userId, tenantId]
  );

  if (!result.rowCount) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.json({ success: true, message: "User deleted successfully" });
};
