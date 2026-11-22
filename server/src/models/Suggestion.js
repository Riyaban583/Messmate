import mongoose from "mongoose";

const suggestionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    submittedBy: { type: String, required: true },
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, required: true, trim: true, maxlength: 500 },
    category: {
      type: String,
      enum: ["Breakfast", "Lunch", "Snacks", "Dinner", "Special Meal"],
      required: true,
    },
    dietary: {
      type: String,
      enum: ["Veg", "Non-Veg", "Jain", "Special"],
      default: "Veg",
    },
    status: {
      type: String,
      enum: ["Under Review", "Approved", "Planned", "Rejected"],
      default: "Under Review",
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    upvoteCount: { type: Number, default: 0 },
    adminComment: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Suggestion = mongoose.models.Suggestion || mongoose.model("Suggestion", suggestionSchema);
