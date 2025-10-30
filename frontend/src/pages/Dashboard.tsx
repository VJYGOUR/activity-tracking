import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { activityAPI } from "../services/api";
import type { ActivityResponse } from "../types";

const Dashboard: React.FC = () => {
  const [todayActivities, setTodayActivities] = useState<ActivityResponse[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTodayActivities();
  }, []);

  const loadTodayActivities = async () => {
    try {
      setLoading(true);
      const activities = await activityAPI.getTodayActivities();
      setTodayActivities(activities);
    } catch (error) {
      console.error("Error loading activities:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals
  const totalMinutes = todayActivities.reduce(
    (sum, activity) => sum + activity.duration,
    0
  );
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  // Group by category
  const categoryTotals = todayActivities.reduce((acc, activity) => {
    const existing = acc.find((item) => item.category === activity.category);
    if (existing) {
      existing.duration += activity.duration;
    } else {
      acc.push({ category: activity.category, duration: activity.duration });
    }
    return acc;
  }, [] as { category: string; duration: number }[]);

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
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <Link
          to="/add-activity"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-500 transition-colors shadow-lg hover:shadow-xl flex items-center space-x-2"
        >
          <span>➕</span>
          <span>Add Activity</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Time Card */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 hover:border-gray-600 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Today's Total</p>
              <p className="text-3xl font-bold text-white">
                {totalHours > 0 && `${totalHours}h `}
                {remainingMinutes > 0 && `${remainingMinutes}m`}
                {totalMinutes === 0 && "0m"}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {totalMinutes} minutes total
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-900/50 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⏱️</span>
            </div>
          </div>
        </div>

        {/* Activities Count */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 hover:border-gray-600 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Activities Today</p>
              <p className="text-3xl font-bold text-white">
                {todayActivities.length}
              </p>
              <p className="text-sm text-gray-500 mt-1">Total entries</p>
            </div>
            <div className="w-12 h-12 bg-green-900/50 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
          </div>
        </div>

        {/* Productivity Score */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 hover:border-gray-600 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Productivity</p>
              <p className="text-3xl font-bold text-white">
                {Math.round(
                  (categoryTotals
                    .filter((cat) =>
                      ["coding", "studying", "reading"].includes(cat.category)
                    )
                    .reduce((sum, cat) => sum + cat.duration, 0) /
                    totalMinutes) *
                    100
                ) || 0}
                %
              </p>
              <p className="text-sm text-gray-500 mt-1">Learning time</p>
            </div>
            <div className="w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Today's Activities</h2>
            <Link
              to="/history"
              className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
            >
              View All →
            </Link>
          </div>

          {todayActivities.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">⏰</div>
              <p className="text-gray-400 mb-4">No activities tracked today</p>
              <Link
                to="/add-activity"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-500 transition-colors"
              >
                Track Your First Activity
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {todayActivities.slice(0, 5).map((activity) => (
                <div
                  key={activity._id}
                  className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors border border-gray-600"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">
                      {getCategoryEmoji(activity.category)}
                    </span>
                    <div>
                      <p className="font-medium text-white capitalize">
                        {activity.category.replace("_", " ")}
                      </p>
                      {activity.notes && (
                        <p className="text-sm text-gray-400 truncate max-w-xs">
                          {activity.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">
                      {formatTime(activity.duration)}
                    </p>
                    <p className="text-sm text-gray-400">
                      {new Date(activity.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category Breakdown */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-6">
            Time by Category
          </h2>

          {categoryTotals.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-400">No data to display</p>
            </div>
          ) : (
            <div className="space-y-4">
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
                    <div className="w-24 bg-gray-700 rounded-full h-2 ml-4">
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
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-800/50">
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/add-activity"
            className="bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-700 hover:border-blue-500 hover:shadow-lg transition-all text-center group"
          >
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
              ➕
            </div>
            <p className="font-medium text-white">Add Activity</p>
          </Link>

          <Link
            to="/categories"
            className="bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-700 hover:border-green-500 hover:shadow-lg transition-all text-center group"
          >
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
              🏷️
            </div>
            <p className="font-medium text-white">Manage Categories</p>
          </Link>

          <Link
            to="/history"
            className="bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-700 hover:border-purple-500 hover:shadow-lg transition-all text-center group"
          >
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
              📝
            </div>
            <p className="font-medium text-white">View History</p>
          </Link>

          <div className="bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-700 text-center group opacity-70">
            <div className="text-2xl mb-2">🎯</div>
            <p className="font-medium text-white">Set Goals</p>
            <p className="text-sm text-gray-400 mt-1">Coming Soon</p>
          </div>
        </div>
      </div>

      {/* Daily Tip */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-lg">💡</span>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-2">Daily Tip</h3>
            <p className="text-gray-300">
              {totalMinutes > 0
                ? `You've spent ${formatTime(
                    totalMinutes
                  )} being productive today! Keep up the great work! 🎉`
                : "Start tracking your time to see where your day goes. Even small activities add up! ⚡"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
