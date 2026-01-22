import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import orgContextMiddleware from "../middleware/orgContextMiddleware";
import { generateTaskSuggestions } from "../controllers/aiController";
import { saveAiTasks } from "../controllers/aiController";

const router = Router();

router.post(
  "/task-suggestions",
  authMiddleware,
  orgContextMiddleware,
  generateTaskSuggestions
);

router.post(
  "/save-tasks",
  authMiddleware,
  orgContextMiddleware,
  saveAiTasks
);

export default router;
