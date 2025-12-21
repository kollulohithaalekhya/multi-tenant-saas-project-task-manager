const db = require('../config/db');

const logAudit = async ({
  tenantId,
  userId,
  action,
  entityType,
  entityId,
  ipAddress
}) => {
  try {
    await db.query(
      `
      INSERT INTO audit_logs
      (tenant_id, user_id, action, entity_type, entity_id, ip_address, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      `,
      [
        tenantId || null,
        userId || null,
        action,
        entityType,
        entityId,
        ipAddress || null
      ]
    );
  } catch (error) {
    console.error('Audit log failed:', error);
    // Do NOT throw error (audit should not break API)
  }
};

module.exports = {
  logAudit
};
