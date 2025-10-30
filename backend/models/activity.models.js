import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    duration: {
      type: Number, // in minutes
      required: [true, "Duration is required"],
      min: [1, "Duration must be at least 1 minute"],
    },
    date: {
      type: String, // Store as "YYYY-MM-DD" for easy querying
      required: [true, "Date is required"],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
  },
  { timestamps: true }
);

// Index for efficient querying
activitySchema.index({ userId: 1, date: -1 });
activitySchema.index({ userId: 1, category: 1 });

const Activity =
  mongoose.models.Activity || mongoose.model("Activity", activitySchema);
export default Activity;
