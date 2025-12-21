INSERT INTO users (
  id,
  tenant_id,
  email,
  password_hash,
  full_name,
  role,
  is_active,
  created_at,
  updated_at
)
VALUES (
  gen_random_uuid(),
  (SELECT id FROM tenants WHERE subdomain='demo'),
  'admin@demo.com',
  '$2b$10$.LCXbMRHem1PvdvpequnLuyi4tfloKTs3GZWDz2Ur/kSZIjJ7s7Gu',
  'Demo Admin',
  'tenant_admin',
  true,
  NOW(),
  NOW()
);
