import pool from "../config/db.js";

/**
 * GET /api/projects/:projectId/tasks
 * List tasks for a project
 */
export const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { tenantId } = req.user;

    const result = await pool.query(
      `
      SELECT
        t.id,
        t.title,
        t.status,
        t.priority,
        t.due_date,
        t.created_at
      FROM tasks t
      WHERE t.project_id = $1
        AND t.tenant_id = $2
      ORDER BY t.created_at DESC
      `,
      [projectId, tenantId]
    );

    res.json({
      success: true,
      data: {
        tasks: result.rows,
      },
    });
  } catch (err) {
    console.error("getTasksByProject error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
    });
  }
};

/**
 * POST /api/projects/:projectId/tasks
 * Create task under a project
 */
export const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { tenantId, userId } = req.user;
    const { title, priority, dueDate } = req.body;

    const result = await pool.query(
      `
      INSERT INTO tasks
      (id, tenant_id, project_id, title, status, priority, due_date, created_by, created_at, updated_at)
      VALUES
      (gen_random_uuid(), $1, $2, $3, 'todo', $4, $5, $6, NOW(), NOW())
      RETURNING *
      `,
      [tenantId, projectId, title, priority || "medium", dueDate || null, userId]
    );

    res.status(201).json({
      success: true,
      data: {
        task: result.rows[0],
      },
    });
  } catch (err) {
    console.error("createTask error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create task",
    });
  }
};

/**
 * PUT /api/tasks/:taskId
 * Update full task
 */
export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { tenantId } = req.user;
    const { title, priority, dueDate, status } = req.body;

    const result = await pool.query(
      `
      UPDATE tasks
      SET
        title = $1,
        priority = $2,
        due_date = $3,
        status = $4,
        updated_at = NOW()
      WHERE id = $5
        AND tenant_id = $6
      RETURNING *
      `,
      [title, priority, dueDate, status, taskId, tenantId]
    );

    if (!result.rowCount) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.json({
      success: true,
      data: {
        task: result.rows[0],
      },
    });
  } catch (err) {
    console.error("updateTask error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update task",
    });
  }
};

/**
 * PATCH /api/tasks/:taskId/status
 * Update only task status
 */
export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { tenantId } = req.user;
    const { status } = req.body;

    const result = await pool.query(
      `
      UPDATE tasks
      SET status = $1, updated_at = NOW()
      WHERE id = $2 AND tenant_id = $3
      RETURNING *
      `,
      [status, taskId, tenantId]
    );

    if (!result.rowCount) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.json({
      success: true,
      data: {
        task: result.rows[0],
      },
    });
  } catch (err) {
    console.error("updateTaskStatus error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update task status",
    });
  }
};

/**
 * DELETE /api/tasks/:taskId
 */
export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { tenantId } = req.user;

    const result = await pool.query(
      `
      DELETE FROM tasks
      WHERE id = $1 AND tenant_id = $2
      `,
      [taskId, tenantId]
    );

    if (!result.rowCount) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.json({
      success: true,
      message: "Task deleted",
    });
  } catch (err) {
    console.error("deleteTask error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete task",
    });
  }
};
