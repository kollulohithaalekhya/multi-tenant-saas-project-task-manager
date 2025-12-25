CREATE INDEX IF NOT EXISTS idx_projects_tenant
ON projects(tenant_id);

CREATE INDEX IF NOT EXISTS idx_tasks_tenant_project
ON tasks(tenant_id, project_id);
