-- 1️⃣ SUPER ADMIN (tenant_id = NULL)
INSERT INTO users (
  id, tenant_id, email, password_hash, full_name, role, is_active
) VALUES (
  gen_random_uuid(),
  NULL,
  'superadmin@system.com',
  '$2b$10$67Xt.65/RjfqrlssVw7huevPS27bZFG8le5ZD8OyC58xJmqs0R6DG',
  'Super Admin',
  'super_admin',
  true
);

-- 2️⃣ TENANT
INSERT INTO tenants (
  id, name, subdomain, status, subscription_plan, max_users, max_projects
) VALUES (
  gen_random_uuid(),
  'Demo Company',
  'demo',
  'active',
  'pro',
  10,
  20
);

-- 3️⃣ TENANT ADMIN
INSERT INTO users (
  id, tenant_id, email, password_hash, full_name, role, is_active
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM tenants WHERE subdomain='demo'),
  'admin@demo.com',
  '$2b$10$67Xt.65/RjfqrlssVw7huevPS27bZFG8le5ZD8OyC58xJmqs0R6DG',
  'Demo Admin',
  'tenant_admin',
  true
);

-- 4️⃣ REGULAR USER
INSERT INTO users (
  id, tenant_id, email, password_hash, full_name, role, is_active
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM tenants WHERE subdomain='demo'),
  'user1@demo.com',
  '$2b$10$67Xt.65/RjfqrlssVw7huevPS27bZFG8le5ZD8OyC58xJmqs0R6DG',
  'Demo User',
  'user',
  true
);

-- 5️⃣ PROJECT
INSERT INTO projects (
  id, tenant_id, name, description, status, created_by
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM tenants WHERE subdomain='demo'),
  'Sample Project',
  'Initial seeded project',
  'active',
  (SELECT id FROM users WHERE email='admin@demo.com')
);

-- 6️⃣ TASK
INSERT INTO tasks (
  id, project_id, tenant_id, title, status, priority
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM projects WHERE name='Sample Project'),
  (SELECT id FROM tenants WHERE subdomain='demo'),
  'Sample Task',
  'todo',
  'medium'
);
