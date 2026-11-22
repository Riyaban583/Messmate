import express from "express";
import { getTodayMenu, getWeeklyMenu, updateMenu } from "../controllers/menuController.js";
import { protect } from "../middleware/authMiddleware.js";
import { restrictTo } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/today", getTodayMenu);
router.get("/", getWeeklyMenu);
router.put("/", protect, restrictTo("admin"), updateMenu);

export default router;
