import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dietary: { type: String, enum: ["Veg", "Non-Veg", "Jain", "Special"], default: "Veg" },
  calories: { type: Number, default: 200 },
  rating: { type: Number, default: 4.2 },
});

const mealSchema = new mongoose.Schema({
  time: { type: String, required: true }, // e.g., "7:30 AM - 9:30 AM"
  items: [menuItemSchema],
  special: { type: String, default: "" },
});

const menuSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      required: true,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },
    meals: {
      breakfast: mealSchema,
      lunch: mealSchema,
      snacks: mealSchema,
      dinner: mealSchema,
    },
    isSpecialMenu: { type: Boolean, default: false },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Menu = mongoose.models.Menu || mongoose.model("Menu", menuSchema);
