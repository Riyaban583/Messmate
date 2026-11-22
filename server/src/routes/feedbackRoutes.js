import express from "express";
import { submitFeedback, getMyFeedback, getAdminFeedback } from "../controllers/feedbackController.js";
import { protect } from "../middleware/authMiddleware.js";
import { restrictTo } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, submitFeedback);
router.get("/my", protect, getMyFeedback);
router.get("/admin", protect, restrictTo("admin"), getAdminFeedback);

export default router;
