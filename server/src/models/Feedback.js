import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: { type: String, required: true },
    foodName: { type: String, required: true },
    mealType: {
      type: String,
      enum: ["Breakfast", "Lunch", "Snacks", "Dinner"],
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: { type: String, trim: true, maxlength: 300 },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },
  },
  { timestamps: true }
);

// Enforce 1 vote per user per food item per day at the database level!
feedbackSchema.index({ userId: 1, foodName: 1, date: 1 }, { unique: true });

export const Feedback = mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);
