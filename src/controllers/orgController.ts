import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Membership from "../models/Membership";
import Organization from "../models/Organization";

export const getMyOrganizations = async (
  req: AuthRequest,
  res: Response
) => {
  const memberships = await Membership.find({ user: req.userId })
    .populate("organization");

  const orgs = memberships.map((m: any) => ({
    id: m.organization._id,
    name: m.organization.name,
    role: m.role
  }));

  res.json(orgs);
};
