import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import { getMyOrganizations } from "../controllers/orgController";

const router = Router();

router.get("/my", authMiddleware, getMyOrganizations);

export default router;
