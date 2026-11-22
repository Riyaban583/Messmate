import express from "express";
import { getAnalyticsSummary } from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";
import { restrictTo } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/summary", protect, restrictTo("admin"), getAnalyticsSummary);
router.get("/", protect, restrictTo("admin"), getAnalyticsSummary);

export default router;
