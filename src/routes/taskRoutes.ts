import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import orgContextMiddleware from "../middleware/orgContextMiddleware";
import { requireRole } from "../middleware/roleMiddleware";
import {
  createTask,
  getTasksByProject,
  updateTask,getTasksWithFilters 
} from "../controllers/taskController";


const router = Router();

// GET TASKS BY PROJECT (ALL MEMBERS)
// router.get(
//   "/project/:projectId",
//   authMiddleware,
//   orgContextMiddleware,
//   getTasksByProject
// );

router.get(
  "/project/:projectId",
  authMiddleware,
  orgContextMiddleware,
  getTasksWithFilters
);

// CREATE TASK (ADMIN & MANAGER)
router.post(
  "/",
  authMiddleware,
  orgContextMiddleware,
  requireRole(["ADMIN", "MANAGER"]),
  createTask
);

// UPDATE TASK (ADMIN & MANAGER)
router.patch(
  "/:taskId",
  authMiddleware,
  orgContextMiddleware,
  requireRole(["ADMIN", "MANAGER"]),
  updateTask
);



export default router;
