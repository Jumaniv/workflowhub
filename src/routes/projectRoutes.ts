import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import { requireRole } from "../middleware/roleMiddleware";
import { createProject, getProjects } from "../controllers/projectController";
import orgContextMiddleware from "../middleware/orgContextMiddleware";

const router = Router();

// router.get("/", authMiddleware, (req, res) => {
//   res.json({ message: "Protected data" });
// });

// CREATE PROJECT (ADMIN, MANAGER ROLES)
router.post(
  "/",
  authMiddleware,
  orgContextMiddleware,
  requireRole(["ADMIN", "MANAGER"]),
  createProject
);

// GET PROJECTS (ALL ROLES)
router.get(
  "/",
  authMiddleware,
  orgContextMiddleware,
  getProjects
);


export default router;
