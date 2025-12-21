router.get("/:tenantId", authenticate, getTenantDetails);
router.put("/:tenantId", authenticate, updateTenant);
router.get("/", authenticate, authorizeRoles("super_admin"), listTenants);
