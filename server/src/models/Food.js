import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["Breakfast", "Lunch", "Snacks", "Dinner"],
      required: true,
    },
    dietary: {
      type: String,
      enum: ["Veg", "Non-Veg", "Jain", "Special"],
      default: "Veg",
    },
    calories: {
      type: Number,
      default: 250,
    },
    avgRating: {
      type: Number,
      default: 4.0,
      min: 1,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Food = mongoose.models.Food || mongoose.model("Food", foodSchema);
