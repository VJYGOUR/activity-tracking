import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      lowercase: true,
    },
    emoji: {
      type: String,
      required: [true, "Emoji is required"],
      default: "📝",
    },
    color: {
      type: String,
      default: "#666666",
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    isProductive: {
      type: Boolean,
      default: false, // User decides if custom category is productive
    },
  },
  { timestamps: true }
);

// Ensure unique categories per user
categorySchema.index({ userId: 1, name: 1 }, { unique: true });

const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);
export default Category;
