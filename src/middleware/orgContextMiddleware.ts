import { Response, NextFunction } from "express";
import Membership from "../models/Membership";
import { AuthRequest } from "./authMiddleware";

export interface OrgRequest extends AuthRequest {
  organizationId?: string;
  role?: string;
}

const orgContextMiddleware = async (
  req: OrgRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const organizationId = req.headers["x-org-id"] as string;

    if (!organizationId) {
      return res.status(400).json({ message: "Organization context missing" });
    }

    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const membership = await Membership.findOne({
      user: req.userId,
      organization: organizationId
    });

    if (!membership) {
      return res.status(403).json({ message: "Access to organization denied" });
    }

    // Attach org context to request
    req.organizationId = organizationId;
    req.role = membership.role;

    next();
  } catch {
    return res.status(500).json({ message: "Organization context failed" });
  }
};

export default orgContextMiddleware;
