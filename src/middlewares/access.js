export function requireUser(req, res, next) {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });
  next();
}

export function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });
  if (req.user.role !== "ADMIN")
    return res.status(403).json({ error: "Admin only" });
  next();
}

// Autoriser certains rôles : allowRoles('ADMIN', 'USER')
export function allowRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    if (!roles.includes(req.user.role))
      return res.status(403).json({ error: "Forbidden" });
    next();
  };
}

// Vérifier propriétaire OU admin, et charger l'entité une fois pour toutes
// Usage: ownOrAdmin(Prescription) (lit :id), ou ownOrAdmin(Prescription, 'owner_id', 'prescriptionId')
export function ownOrAdmin(Model, foreignKey = "user_id", param = "id") {
  return async (req, res, next) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });

      const entity = await Model.findByPk(req.params[param]);
      if (!entity) return res.status(404).json({ error: "Not found" });

      if (
        req.user.role !== "ADMIN" &&
        Number(entity[foreignKey]) !== Number(req.user.userId)
      ) {
        return res.status(403).json({ error: "Forbidden" });
      }

      // injecter l'entité pour éviter une 2e requête dans le handler
      req.entity = entity;
      next();
    } catch (e) {
      next(e);
    }
  };
}
