import { Response, NextFunction } from "express";
import { OrgRequest } from "./orgContextMiddleware";

export const requireRole = (roles: string[]) => {
  return (req: OrgRequest, res: Response, next: NextFunction) => {
    if (!req.role) {
      return res.status(403).json({ message: "Role not resolved" });
    }

    if (!roles.includes(req.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};
