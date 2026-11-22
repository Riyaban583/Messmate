import express from "express";
import { submitComplaint, getMyComplaints, getAdminComplaints, updateComplaintStatus } from "../controllers/complaintController.js";
import { protect } from "../middleware/authMiddleware.js";
import { restrictTo } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, submitComplaint);
router.get("/my", protect, getMyComplaints);
router.get("/admin", protect, restrictTo("admin"), getAdminComplaints);
router.put("/admin/:id/status", protect, restrictTo("admin"), updateComplaintStatus);

export default router;
