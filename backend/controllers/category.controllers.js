import Category from "../models/category.models.js";

// Default categories that come with every account
const defaultCategories = [
  { name: "coding", emoji: "💻", color: "#3B82F6", isDefault: true },
  { name: "studying", emoji: "📚", color: "#10B981", isDefault: true },
  { name: "reading", emoji: "📖", color: "#8B5CF6", isDefault: true },
  { name: "speaking", emoji: "🗣️", color: "#F59E0B", isDefault: true },
  { name: "gf_time", emoji: "💑", color: "#EC4899", isDefault: true },
];

// @desc    Get all categories for user (default + custom)
// @route   GET /api/categories
// @access  Private
export const getCategories = async (req, res) => {
  try {
    const userId = req.userId;

    // Get user's custom categories
    const customCategories = await Category.find({ userId });

    // Combine default and custom categories
    const allCategories = [
      ...defaultCategories,
      ...customCategories.map((cat) => ({
        name: cat.name,
        emoji: cat.emoji,
        color: cat.color,
        isDefault: false,
        _id: cat._id,
      })),
    ];

    res.json({
      success: true,
      data: allCategories,
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Create a new custom category
// @route   POST /api/categories
// @access  Private
export const createCategory = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, emoji, color } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    // Check if category already exists (case insensitive)
    const existingCategory = await Category.findOne({
      userId,
      name: name.toLowerCase().trim(),
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    // Check if it conflicts with default categories
    const defaultCategoryExists = defaultCategories.some(
      (cat) => cat.name === name.toLowerCase().trim()
    );

    if (defaultCategoryExists) {
      return res.status(400).json({
        success: false,
        message: "This category name is reserved",
      });
    }

    // Create new category
    const category = new Category({
      userId,
      name: name.toLowerCase().trim(),
      emoji: emoji || "📝",
      color: color || "#666666",
      isDefault: false,
    });

    await category.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Delete a custom category
// @route   DELETE /api/categories/:id
// @access  Private
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const category = await Category.findOne({ _id: id, userId });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Prevent deletion of default categories
    if (category.isDefault) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete default categories",
      });
    }

    await Category.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Update a custom category
// @route   PUT /api/categories/:id
// @access  Private
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { name, emoji, color } = req.body;

    const category = await Category.findOne({ _id: id, userId });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Prevent modification of default categories
    if (category.isDefault) {
      return res.status(400).json({
        success: false,
        message: "Cannot modify default categories",
      });
    }

    // Update fields if provided
    if (name) category.name = name.toLowerCase().trim();
    if (emoji) category.emoji = emoji;
    if (color) category.color = color;

    await category.save();

    res.json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
