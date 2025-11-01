import React, { useState, useEffect } from "react";
import { categoryAPI } from "../services/api";
import type { CategoryResponse, CreateCategoryData } from "../types";

// Extend CategoryResponse to include _id for custom categories
interface CustomCategory extends CategoryResponse {
  _id?: string;
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<CreateCategoryData>({
    name: "",
    emoji: "📝",
    color: "#666666",
    isProductive: false,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const categoryList = await categoryAPI.getCategories();
      setCategories(categoryList);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter a category name");
      return;
    }

    try {
      await categoryAPI.createCategory(formData);
      // Reset form and reload categories
      setFormData({
        name: "",
        emoji: "📝",
        color: "#666666",
        isProductive: false,
      });
      setShowAddForm(false);
      await loadCategories();
    } catch (error: unknown) {
      console.error("Error creating category:", error);
      // Type-safe error handling
      if (error instanceof Error) {
        alert(error.message || "Failed to create category");
      } else {
        alert("Failed to create category");
      }
    }
  };

  const deleteCategory = async (
    categoryId: string | undefined,
    categoryName: string
  ) => {
    if (!categoryId) {
      // This is a default category, show message
      alert("Default categories cannot be deleted");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to delete the "${categoryName}" category?`
      )
    ) {
      return;
    }

    try {
      await categoryAPI.deleteCategory(categoryId);
      await loadCategories();
    } catch (error: unknown) {
      console.error("Error deleting category:", error);
      if (error instanceof Error) {
        alert(error.message || "Failed to delete category");
      } else {
        alert("Failed to delete category");
      }
    }
  };

  const commonEmojis = [
    "📝",
    "🎮",
    "🏋️",
    "🍳",
    "🎵",
    "🚗",
    "📺",
    "😴",
    "🎨",
    "🏠",
    "🚶",
    "☕",
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const defaultCategories = categories.filter((cat) => cat.isDefault);
  const customCategories = categories.filter(
    (cat) => !cat.isDefault
  ) as CustomCategory[];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Categories</h1>
          <p className="text-gray-400 mt-1">Manage your activity categories</p>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-500 transition-colors shadow-lg hover:shadow-xl flex items-center space-x-2"
        >
          <span>➕</span>
          <span>Add Category</span>
        </button>
      </div>

      {/* Add Category Form */}
      {showAddForm && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">
            Add New Category
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Emoji Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Emoji
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {commonEmojis.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, emoji }))
                      }
                      className={`p-2 rounded-lg text-xl transition-colors ${
                        formData.emoji === emoji
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Color
                </label>
                <div className="flex space-x-2">
                  {[
                    "#3B82F6",
                    "#10B981",
                    "#8B5CF6",
                    "#F59E0B",
                    "#EC4899",
                    "#666666",
                  ].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, color }))
                      }
                      className={`w-8 h-8 rounded-full border-2 transition-transform ${
                        formData.color === color
                          ? "border-white scale-110"
                          : "border-gray-600 hover:scale-105"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Category Name - Full width */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="e.g., gaming, gym, cooking..."
                  maxLength={20}
                />
              </div>

              {/* Productivity Toggle - Full width */}
              <div className="md:col-span-2">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.isProductive || false}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isProductive: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-white font-medium">
                    Count as productive time
                  </span>
                </label>
                <p className="text-gray-400 text-sm mt-1 ml-7">
                  Productive categories contribute to your productivity score.
                  Only coding, studying, and reading are productive by default.
                </p>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setFormData({
                    name: "",
                    emoji: "📝",
                    color: "#666666",
                    isProductive: false,
                  });
                }}
                className="flex-1 bg-gray-700 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-600 transition-colors border border-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!formData.name.trim()}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Category
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Default Categories */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">
          Default Categories
        </h2>
        <p className="text-gray-400 mb-6">
          These categories come with your account and cannot be modified.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {defaultCategories.map((category) => (
            <div
              key={category.name}
              className="bg-gray-700/50 p-4 rounded-lg border border-gray-600 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl" style={{ color: category.color }}>
                  {category.emoji}
                </span>
                <div>
                  <span className="font-medium text-white capitalize block">
                    {category.name.replace("_", " ")}
                  </span>
                  {category.isProductive && (
                    <span className="text-xs text-green-400 block mt-1">
                      Productive
                    </span>
                  )}
                </div>
              </div>
              <span className="text-xs text-gray-400 px-2 py-1 bg-gray-600 rounded">
                Default
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Categories */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Your Categories</h2>
          <span className="text-gray-400">
            {customCategories.length} category
            {customCategories.length !== 1 ? "s" : ""}
          </span>
        </div>

        {customCategories.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🏷️</div>
            <p className="text-gray-400 text-lg mb-4">
              No custom categories yet
            </p>
            <p className="text-gray-500">
              Create your first custom category to track specific activities!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {customCategories.map((category) => (
              <div
                key={category.name}
                className="bg-gray-700/50 p-4 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl" style={{ color: category.color }}>
                    {category.emoji}
                  </span>
                  <button
                    onClick={() => deleteCategory(category._id, category.name)}
                    className="opacity-100 md:opacity-0 md:group-hover:opacity-100 p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-all duration-200 group/delete"
                    title="Delete category"
                  >
                    <svg
                      className="w-4 h-4 text-red-400 group-hover/delete:text-red-300 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
                <p className="font-medium text-white capitalize">
                  {category.name.replace("_", " ")}
                </p>
                {category.isProductive && (
                  <span className="text-xs text-green-400 block mt-1">
                    Productive
                  </span>
                )}
                <div
                  className="w-full h-1 rounded-full mt-2"
                  style={{ backgroundColor: category.color }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-800/50">
        <h3 className="text-lg font-semibold text-white mb-2">
          💡 Category Tips
        </h3>
        <ul className="text-gray-300 space-y-1 text-sm">
          <li>• Create categories for activities you do regularly</li>
          <li>• Use emojis to make categories easily recognizable</li>
          <li>• Different colors help distinguish categories at a glance</li>
          <li>
            • Mark categories as "productive" to include them in your
            productivity score
          </li>
          <li>• You can track time against any custom category</li>
        </ul>
      </div>
    </div>
  );
};

export default Categories;
