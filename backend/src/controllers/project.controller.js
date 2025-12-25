import pool from "../config/db.js";
import { logAudit } from "../services/audit.service.js";
/**
 * GET /api/projects
 * List all projects for current tenant
 */
export const listProjects = async (req, res) => {
  try {
    const { tenantId } = req.user;

    const result = await pool.query(
      `
      SELECT id, name, description, status, created_at
      FROM projects
      WHERE tenant_id = $1
      ORDER BY created_at DESC
      `,
      [tenantId]
    );

    res.json({
      success: true,
      data: {
        projects: result.rows,
      },
    });
  } catch (err) {
    console.error("listProjects error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
    });
  }
};

/**
 * POST /api/projects
 * Create new project
 */
export const createProject = async (req, res) => {
  try {
    const { tenantId, userId } = req.user;
    const { name, description } = req.body;
    // 1️⃣ Get tenant limits
const tenantRes = await pool.query(
  "SELECT max_projects FROM tenants WHERE id = $1",
  [tenantId]
);

const maxProjects = tenantRes.rows[0].max_projects;

// 2️⃣ Count existing projects
const countRes = await pool.query(
  "SELECT COUNT(*) FROM projects WHERE tenant_id = $1",
  [tenantId]
);

if (Number(countRes.rows[0].count) >= maxProjects) {
  return res.status(403).json({
    success: false,
    message: "Project limit exceeded for your subscription plan",
  });
}

    const result = await pool.query(
      `
      INSERT INTO projects
      (id, tenant_id, name, description, status, created_at, updated_at)
      VALUES (gen_random_uuid(), $1, $2, $3, 'active', NOW(), NOW())
      RETURNING *
      `,
      [tenantId, name, description]
    );
    await logAudit({
  tenantId,
  userId,
  action: "CREATE",
  entityType: "project",
  entityId: result.rows[0].id,
  ipAddress: req.ip,
});

    res.status(201).json({
      success: true,
      data: {
        project: result.rows[0],
      },
    });
  } catch (err) {
    console.error("createProject error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create project",
    });
  }
};

/**
 * PUT /api/projects/:projectId
 */
export const updateProject = async (req, res) => {
  try {
    const { tenantId, userId } = req.user;
    const { projectId } = req.params;
    const { name, description, status } = req.body;

    const result = await pool.query(
      `
      UPDATE projects
      SET name=$1, description=$2, status=$3, updated_at=NOW()
      WHERE id=$4 AND tenant_id=$5
      RETURNING *
      `,
      [name, description, status, projectId, tenantId]
    );
    await logAudit({
  tenantId,
  userId,
  action: "UPDATE",
  entityType: "project",
  entityId: projectId,
  ipAddress: req.ip,
});


    if (!result.rowCount) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.json({
      success: true,
      data: {
        project: result.rows[0],
      },
    });
  } catch (err) {
    console.error("updateProject error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update project",
    });
  }
};

/**
 * DELETE /api/projects/:projectId
 */
export const deleteProject = async (req, res) => {
  try {
    const { tenantId, userId } = req.user;

    const { projectId } = req.params;

    const result = await pool.query(
      `
      DELETE FROM projects
      WHERE id=$1 AND tenant_id=$2
      `,
      [projectId, tenantId]
    );
    await logAudit({
  tenantId,
  userId,
  action: "DELETE",
  entityType: "project",
  entityId: projectId,
  ipAddress: req.ip,
});

    if (!result.rowCount) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.json({
      success: true,
      message: "Project deleted",
    });
  } catch (err) {
    console.error("deleteProject error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete project",
    });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { tenantId } = req.user;

    const result = await pool.query(
      `SELECT * FROM projects WHERE id = $1 AND tenant_id = $2`,
      [projectId, tenantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error("getProjectById error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch project",
    });
  }
};
