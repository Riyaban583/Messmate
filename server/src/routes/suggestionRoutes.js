import express from "express";
import { getSuggestions, submitSuggestion, voteSuggestion, updateSuggestionStatus } from "../controllers/suggestionController.js";
import { protect } from "../middleware/authMiddleware.js";
import { restrictTo } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", getSuggestions);
router.post("/", protect, submitSuggestion);
router.post("/:id/vote", protect, voteSuggestion);
router.put("/admin/:id", protect, restrictTo("admin"), updateSuggestionStatus);

export default router;
