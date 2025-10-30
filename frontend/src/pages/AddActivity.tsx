import React, { useState, useEffect } from "react";

import { activityAPI, categoryAPI } from "../services/api";
import type { CreateActivityData, CategoryResponse } from "../types";

const AddActivity: React.FC = () => {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateActivityData>({
    category: "",
    duration: 30,
    notes: "",
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoryList = await categoryAPI.getCategories();
        setCategories(categoryList);
        // Set default category if available using functional update to avoid stale formData
        if (categoryList.length > 0) {
          setFormData((prev) =>
            prev.category ? prev : { ...prev, category: categoryList[0].name }
          );
        }
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };

    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.category) {
      alert("Please select a category");
      return;
    }

    if (formData.duration < 1) {
      alert("Duration must be at least 1 minute");
      return;
    }

    setLoading(true);
    try {
      await activityAPI.createActivity(formData);
      // Reset form
      setFormData({
        category: categories[0]?.name || "",
        duration: 30,
        notes: "",
      });
      // Show success message
      alert("Activity added successfully!");
      // Redirect to dashboard
    } catch (error) {
      console.error("Error creating activity:", error);
      alert("Failed to add activity. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof CreateActivityData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const quickDurations = [15, 30, 45, 60, 90, 120];

  const getCategoryEmoji = (categoryName: string) => {
    const category = categories.find((cat) => cat.name === categoryName);
    return category?.emoji || "⏱️";
  };
  console.log(getCategoryEmoji);
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Add Activity</h1>
        <p className="text-gray-400">Track how you spent your time</p>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {categories.map((category) => (
                <button
                  key={category.name}
                  type="button"
                  onClick={() => handleInputChange("category", category.name)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.category === category.name
                      ? "border-blue-500 bg-blue-900/30 text-white"
                      : "border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500 hover:bg-gray-600/50"
                  }`}
                >
                  <div className="text-2xl mb-1">{category.emoji}</div>
                  <div className="text-sm font-medium capitalize">
                    {category.name.replace("_", " ")}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Duration Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Duration
            </label>

            {/* Quick Duration Buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
              {quickDurations.map((minutes) => (
                <button
                  key={minutes}
                  type="button"
                  onClick={() => handleInputChange("duration", minutes)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    formData.duration === minutes
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {minutes}m
                </button>
              ))}
            </div>

            {/* Custom Duration Input */}
            <div className="flex items-center space-x-4">
              <input
                type="number"
                min="1"
                max="1440" // 24 hours
                value={formData.duration}
                onChange={(e) =>
                  handleInputChange("duration", parseInt(e.target.value) || 0)
                }
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                placeholder="Enter duration in minutes"
              />
              <div className="text-gray-400 text-sm whitespace-nowrap">
                = {Math.floor(formData.duration / 60)}h {formData.duration % 60}
                m
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={3}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
              placeholder="What did you work on? Any details..."
              maxLength={500}
            />
            <div className="text-right text-sm text-gray-400 mt-1">
              {formData.notes?.length || 0}/500
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              className="flex-1 bg-gray-700 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-600 transition-colors border border-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.category}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding...
                </>
              ) : (
                <>
                  <span className="mr-2">➕</span>
                  Add Activity
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Recent Activities Preview */}
      <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">
          Quick Add Examples
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="bg-gray-700/50 p-4 rounded-lg border border-gray-600 cursor-pointer hover:border-blue-500 transition-colors"
            onClick={() => {
              setFormData({
                category: "coding",
                duration: 120,
                notes: "Working on project features",
              });
            }}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">💻</span>
              <div>
                <p className="font-medium text-white">Coding Session</p>
                <p className="text-sm text-gray-400">2 hours • Project work</p>
              </div>
            </div>
          </div>

          <div
            className="bg-gray-700/50 p-4 rounded-lg border border-gray-600 cursor-pointer hover:border-green-500 transition-colors"
            onClick={() => {
              setFormData({
                category: "studying",
                duration: 45,
                notes: "Learning new concepts",
              });
            }}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📚</span>
              <div>
                <p className="font-medium text-white">Study Time</p>
                <p className="text-sm text-gray-400">45 mins • Learning</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddActivity;
