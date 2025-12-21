export function tenantScope(req, res, next) {
  if (req.user.role !== "super_admin") {
    req.tenantId = req.user.tenantId;
  }
  next();
}
