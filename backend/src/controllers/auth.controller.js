import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const registerTenant = async (req, res) => {
  const client = await pool.connect();
  try {
    const {
      tenantName,
      subdomain,
      adminEmail,
      adminPassword,
      adminFullName,
    } = req.body;

    await client.query("BEGIN");

    const exists = await client.query(
      "SELECT id FROM tenants WHERE subdomain=$1",
      [subdomain]
    );
    if (exists.rowCount > 0) {
      return res.status(409).json({ success: false, message: "Subdomain exists" });
    }

    const tenantRes = await client.query(
      `
      INSERT INTO tenants
      (id, name, subdomain, status, subscription_plan, max_users, max_projects, created_at, updated_at)
      VALUES (gen_random_uuid(), $1, $2, 'active', 'free', 3, 3, NOW(), NOW())
      RETURNING id
      `,
      [tenantName, subdomain]
    );

    const tenantId = tenantRes.rows[0].id;
    const hash = await bcrypt.hash(adminPassword, 10);

    const userRes = await client.query(
      `
      INSERT INTO users
      (id, tenant_id, email, password_hash, full_name, role, is_active, created_at, updated_at)
      VALUES (gen_random_uuid(), $1, $2, $3, $4, 'tenant_admin', true, NOW(), NOW())
      RETURNING id, email, full_name, role
      `,
      [tenantId, adminEmail, hash, adminFullName]
    );

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      message: "Tenant registered successfully",
      data: {
        tenantId,
        subdomain,
        adminUser: userRes.rows[0],
      },
    });
  } catch (e) {
    await client.query("ROLLBACK");
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
};

export const login = async (req, res) => {
  console.log("LOGIN BODY:", req.body);

  const { email, password, tenantSubdomain } = req.body;

  const tenantRes = await pool.query(
    "SELECT id, status FROM tenants WHERE subdomain=$1",
    [tenantSubdomain]
  );
  if (!tenantRes.rowCount) {
    return res.status(404).json({ success: false, message: "Tenant not found" });
  }

  const tenant = tenantRes.rows[0];
  if (tenant.status !== "active") {
    return res.status(403).json({ success: false, message: "Tenant inactive" });
  }

  const userRes = await pool.query(
    `
    SELECT id, email, full_name, role, password_hash
    FROM users
    WHERE email=$1 AND tenant_id=$2 AND is_active=true
    `,
    [email, tenant.id]
  );

  if (!userRes.rowCount) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  const user = userRes.rows[0];
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { userId: user.id, tenantId: tenant.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        tenantId: tenant.id,
      },
      token,
      expiresIn: 86400,
    },
  });
};

export const getCurrentUser = async (req, res) => {
  const { userId, tenantId } = req.user;

  const result = await pool.query(
  `
  SELECT 
    u.id,
    u.email,
    u.full_name,
    u.role,
    u.tenant_id,     
    t.name AS tenant_name,
    t.subdomain
  FROM users u
  JOIN tenants t ON t.id = u.tenant_id
  WHERE u.id=$1 AND t.id=$2
  `,
  [userId, tenantId]
);

  if (!result.rowCount) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.json({ success: true, data: result.rows[0] });
};
