import pool from "../config/db.js";
import bcrypt from "bcrypt";

/**
 * ADD USER (API-7)
 */
export const addUser = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { email, password, fullName, role } = req.body;

    const tenantRes = await pool.query(
      "SELECT max_users FROM tenants WHERE id=$1",
      [tenantId]
    );

    const countRes = await pool.query(
      "SELECT COUNT(*) FROM users WHERE tenant_id=$1",
      [tenantId]
    );

    if (Number(countRes.rows[0].count) >= tenantRes.rows[0].max_users) {
      return res.status(403).json({
        success: false,
        message: "User limit exceeded for your plan",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO users
      (id, tenant_id, email, password_hash, full_name, role, is_active)
      VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, true)
      RETURNING id, email, full_name, role
      `,
      [tenantId, email, hash, fullName, role]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to add user" });
  }
};

/**
 * LIST USERS (API-8)
 */
export const listUsers = async (req, res) => {
  const { tenantId } = req.user;

  const result = await pool.query(
    `
    SELECT id, email, full_name, role
    FROM users
    WHERE tenant_id=$1
    ORDER BY created_at ASC
    `,
    [tenantId]
  );

  res.json({ success: true, data: result.rows });
};

/**
 * UPDATE USER (API-9)
 */
export const updateUser = async (req, res) => {
  const { tenantId } = req.user;
  const { userId } = req.params;
  const { fullName, role } = req.body;

  const result = await pool.query(
    `
    UPDATE users
    SET full_name=$1, role=$2, updated_at=NOW()
    WHERE id=$3 AND tenant_id=$4
    RETURNING id, email, full_name, role
    `,
    [fullName, role, userId, tenantId]
  );

  if (!result.rowCount) {
    return res.status(404).json({
      success: false,
      message: "User not found or not in tenant",
    });
  }

  res.json({ success: true, data: result.rows[0] });
};

/**
 * DELETE USER (API-10)
 */
export const deleteUser = async (req, res) => {
  const { tenantId, userId: currentUserId } = req.user;
  const { userId } = req.params;

  if (userId === currentUserId) {
    return res.status(403).json({
      success: false,
      message: "Cannot delete yourself",
    });
  }

  const result = await pool.query(
    `
    DELETE FROM users
    WHERE id=$1 AND tenant_id=$2
    `,
    [userId, tenantId]
  );

  if (!result.rowCount) {
    return res.status(404).json({
      success: false,
      message: "User not found or already deleted",
    });
  }

  res.json({ success: true, message: "User deleted successfully" });
};
