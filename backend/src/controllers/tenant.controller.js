import pool from "../config/db.js";

export const getTenantDetails = async (req, res) => {
  const { tenantId } = req.user;

  const result = await pool.query(
    "SELECT id, name, subdomain, status, subscription_plan FROM tenants WHERE id=$1",
    [tenantId]
  );

  res.json({ success: true, data: result.rows[0] });
};

export const updateTenant = async (req, res) => {
  const { tenantId } = req.user;
  const { name, status } = req.body;

  const result = await pool.query(
    `
    UPDATE tenants
    SET name=$1, status=$2, updated_at=NOW()
    WHERE id=$3
    RETURNING *
    `,
    [name, status, tenantId]
  );

  res.json({ success: true, data: result.rows[0] });
};
export const listTenants = async (req, res) => {
  const { role } = req.user;

  if (role !== "super_admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  }

  const result = await pool.query(
    "SELECT id, name, subdomain, status FROM tenants ORDER BY created_at DESC"
  );

  res.json({ success: true, data: result.rows });
};

