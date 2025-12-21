router.post("/tenants/:tenantId/users", authenticate, authorizeRoles("tenant_admin"), addUser);
router.get("/tenants/:tenantId/users", authenticate, listUsers);
router.put("/users/:userId", authenticate, updateUser);
router.delete("/users/:userId", authenticate, authorizeRoles("tenant_admin"), deleteUser);
