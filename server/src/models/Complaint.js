import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    studentName: { type: String, required: true },
    studentEmail: { type: String, required: true },
    roomNumber: { type: String, default: "N/A" },
    category: {
      type: String,
      enum: ["Food Quality", "Hygiene", "Quantity", "Staff Behavior", "Timing", "Other"],
      required: true,
    },
    meal: {
      type: String,
      enum: ["Breakfast", "Lunch", "Snacks", "Dinner", "General"],
      default: "General",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Pending", "Under Review", "In Progress", "Resolved", "Rejected"],
      default: "Pending",
    },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 1000 },
    adminResponse: { type: String, default: "" },
    resolvedAt: { type: Date },
    isAnonymous: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Complaint = mongoose.models.Complaint || mongoose.model("Complaint", complaintSchema);
