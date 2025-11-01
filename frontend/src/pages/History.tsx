import React, { useState, useEffect } from "react";
import { activityAPI } from "../services/api";
import type { ActivityResponse } from "../types";

const History: React.FC = () => {
  const [activities, setActivities] = useState<ActivityResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [view, setView] = useState<"list" | "calendar">("list");

  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true);
        const data = await activityAPI.getActivitiesByDate(selectedDate);
        setActivities(data);
      } catch (error) {
        console.error("Error loading activities:", error);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, [selectedDate]);

  const deleteActivity = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this activity?")) {
      return;
    }

    try {
      await activityAPI.deleteActivity(id);
      // Remove from local state
      setActivities((prev) => prev.filter((activity) => activity._id !== id));
    } catch (error) {
      console.error("Error deleting activity:", error);
      alert("Failed to delete activity");
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getCategoryEmoji = (category: string) => {
    const emojis: { [key: string]: string } = {
      coding: "💻",
      studying: "📚",
      reading: "📖",
      speaking: "🗣️",
      gf_time: "💑",
      gaming: "🎮",
      gym: "🏋️",
      cooking: "🍳",
      music: "🎵",
      commute: "🚗",
    };
    return emojis[category] || "⏱️";
  };

  // Calculate totals for the selected date
  const totalMinutes = activities.reduce(
    (sum, activity) => sum + activity.duration,
    0
  );
  const categoryTotals = activities.reduce((acc, activity) => {
    const existing = acc.find((item) => item.category === activity.category);
    if (existing) {
      existing.duration += activity.duration;
    } else {
      acc.push({ category: activity.category, duration: activity.duration });
    }
    return acc;
  }, [] as { category: string; duration: number }[]);

  // Generate last 7 days for quick selection
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split("T")[0];
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Activity History</h1>
          <p className="text-gray-400 mt-1">
            View and manage your tracked time
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex space-x-2 bg-gray-800 p-1 rounded-lg">
          <button
            onClick={() => setView("list")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              view === "list"
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            📝 List
          </button>
          <button
            onClick={() => setView("calendar")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              view === "calendar"
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            📅 Calendar
          </button>
        </div>
      </div>

      {/* Date Selection */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Quick Date Selection */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Quick Select
            </label>
            <div className="flex flex-wrap gap-2">
              {last7Days.map((date) => (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    selectedDate === date
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {new Date(date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                  {date === new Date().toISOString().split("T")[0] &&
                    " (Today)"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Time</p>
              <p className="text-2xl font-bold text-white">
                {formatTime(totalMinutes)}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-900/50 rounded-lg flex items-center justify-center">
              <span className="text-xl">⏱️</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Activities</p>
              <p className="text-2xl font-bold text-white">
                {activities.length}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-900/50 rounded-lg flex items-center justify-center">
              <span className="text-xl">📝</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Categories</p>
              <p className="text-2xl font-bold text-white">
                {categoryTotals.length}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-900/50 rounded-lg flex items-center justify-center">
              <span className="text-xl">🏷️</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activities List */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-6">
          Activities for{" "}
          {new Date(selectedDate).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </h2>

        {activities.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-400 text-lg mb-4">
              No activities found for this date
            </p>
            <p className="text-gray-500">
              Start tracking your time to see your history here!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity._id}
                className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors group"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <span className="text-2xl">
                    {getCategoryEmoji(activity.category)}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-white capitalize">
                      {activity.category.replace("_", " ")}
                    </p>
                    {activity.notes && (
                      <p className="text-sm text-gray-400 mt-1">
                        {activity.notes}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Added at{" "}
                      {new Date(activity.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="font-bold text-white text-lg">
                    {formatTime(activity.duration)}
                  </span>
                  <button
                    onClick={() => deleteActivity(activity._id)}
                    className="opacity-100 md:opacity-0 md:group-hover:opacity-100 p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-all duration-200 group/delete"
                    title="Delete activity"
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
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Category Breakdown */}
      {categoryTotals.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">
            Time by Category
          </h3>
          <div className="space-y-3">
            {categoryTotals
              .sort((a, b) => b.duration - a.duration)
              .map((category) => (
                <div
                  key={category.category}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <span className="text-xl">
                      {getCategoryEmoji(category.category)}
                    </span>
                    <span className="font-medium text-white capitalize flex-1">
                      {category.category.replace("_", " ")}
                    </span>
                    <span className="text-white font-bold">
                      {formatTime(category.duration)}
                    </span>
                  </div>
                  <div className="w-32 bg-gray-700 rounded-full h-2 ml-4">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${(category.duration / totalMinutes) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
