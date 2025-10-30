import React, { useState, useEffect, useCallback } from "react";
import { analyticsAPI } from "../services/analyticsAPI";
import type { AnalyticsData } from "../types";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    dataKey: string;
    payload: Record<string, unknown>;
  }>;
  label?: string;
}

const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"weekly" | "monthly" | "custom">(
    "weekly"
  );
  const [customRange, setCustomRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  const loadAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      let data: AnalyticsData;

      switch (timeRange) {
        case "weekly":
          data = await analyticsAPI.getWeeklyAnalytics();
          break;
        case "monthly":
          data = await analyticsAPI.getMonthlyAnalytics();
          break;
        case "custom":
          data = await analyticsAPI.getDateRangeAnalytics(
            customRange.startDate,
            customRange.endDate
          );
          break;
        default:
          data = await analyticsAPI.getWeeklyAnalytics();
      }

      const completeData: AnalyticsData = {
        ...data,
        averageDailyTime:
          data.averageDailyTime ||
          Math.round(data.totalMinutes / (timeRange === "weekly" ? 7 : 30)),
        mostProductiveDay:
          data.mostProductiveDay ||
          data.dailyData[0]?.date ||
          new Date().toISOString().split("T")[0],
      };

      setAnalyticsData(completeData);
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  }, [timeRange, customRange.startDate, customRange.endDate]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const getDailyChartData = () => {
    if (!analyticsData) return [];
    return analyticsData.dailyData.map((day) => ({
      date: new Date(day.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      minutes: day.minutes,
      hours: Math.round((day.minutes / 60) * 100) / 100,
      activities: day.activities,
    }));
  };

  const getCategoryPieData = () => {
    if (!analyticsData) return [];
    return analyticsData.categoryData.map((category) => ({
      name: category.category.replace("_", " "),
      value: category.minutes,
      minutes: category.minutes,
      percentage: category.percentage,
    }));
  };

  const COLORS = [
    "#3B82F6",
    "#10B981",
    "#8B5CF6",
    "#F59E0B",
    "#EC4899",
    "#6366F1",
    "#84CC16",
    "#EF4444",
  ];

  const getCategoryEmoji = (category: string): string => {
    const emojis: Record<string, string> = {
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

  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const formatDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  const CustomTooltip: React.FC<CustomTooltipProps> = ({
    active,
    payload,
    label,
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-600 p-3 rounded-lg shadow-lg">
          <p className="text-white font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}:{" "}
              {formatTime(entry.value * (entry.dataKey === "hours" ? 60 : 1))}
              {entry.dataKey === "hours" && ` (${entry.value.toFixed(1)}h)`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as {
        name: string;
        value: number;
        percentage: number;
      };
      return (
        <div className="bg-gray-800 border border-gray-600 p-3 rounded-lg shadow-lg">
          <p className="text-white font-medium">{data.name}</p>
          <p className="text-sm text-blue-400">
            Time: {formatTime(data.value)}
          </p>
          <p className="text-sm text-gray-400">
            Percentage: {data.percentage}%
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📊</div>
        <p className="text-gray-400 text-lg">No analytics data available</p>
        <p className="text-gray-500">
          Start tracking your time to see analytics!
        </p>
      </div>
    );
  }

  const dailyChartData = getDailyChartData();
  const categoryPieData = getCategoryPieData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Time Analytics</h1>
          <p className="text-gray-400 mt-1">
            Deep insights into your productivity with interactive charts
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex bg-gray-800 p-1 rounded-lg">
            <button
              onClick={() => setTimeRange("weekly")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                timeRange === "weekly"
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              📅 Weekly
            </button>
            <button
              onClick={() => setTimeRange("monthly")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                timeRange === "monthly"
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              📆 Monthly
            </button>
            <button
              onClick={() => setTimeRange("custom")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                timeRange === "custom"
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              📋 Custom
            </button>
          </div>
        </div>
      </div>

      {timeRange === "custom" && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={customRange.startDate}
                onChange={(e) =>
                  setCustomRange((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={customRange.endDate}
                onChange={(e) =>
                  setCustomRange((prev) => ({
                    ...prev,
                    endDate: e.target.value,
                  }))
                }
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              onClick={loadAnalytics}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-500 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Time</p>
              <p className="text-2xl font-bold text-white">
                {formatTime(analyticsData.totalMinutes)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {analyticsData.totalActivities} activities
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-900/50 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⏱️</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Productivity</p>
              <p className="text-2xl font-bold text-white">
                {analyticsData.productivityScore}%
              </p>
              <p className="text-sm text-gray-500 mt-1">Learning time</p>
            </div>
            <div className="w-12 h-12 bg-green-900/50 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Daily Average</p>
              <p className="text-2xl font-bold text-white">
                {formatTime(analyticsData.averageDailyTime)}
              </p>
              <p className="text-sm text-gray-500 mt-1">Per day</p>
            </div>
            <div className="w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Peak Day</p>
              <p className="text-lg font-bold text-white">
                {formatDate(analyticsData.mostProductiveDay)}
              </p>
              <p className="text-sm text-gray-500 mt-1">Most productive</p>
            </div>
            <div className="w-12 h-12 bg-yellow-900/50 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🚀</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-6">
            📅 Daily Time Distribution
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                <YAxis
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={(value: number) => `${value}h`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="hours"
                  name="Time Spent"
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* FIXED: Pie Chart without custom labels - using Legend instead */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-6">
            🏷️ Time by Category
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryPieData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-6">
          📋 Detailed Category Breakdown
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left py-3 text-gray-400 font-medium">
                  Category
                </th>
                <th className="text-right py-3 text-gray-400 font-medium">
                  Time
                </th>
                <th className="text-right py-3 text-gray-400 font-medium">
                  Percentage
                </th>
                <th className="text-right py-3 text-gray-400 font-medium">
                  Hours
                </th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.categoryData.map((category) => (
                <tr
                  key={category.category}
                  className="border-b border-gray-700/50 last:border-0"
                >
                  <td className="py-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">
                        {getCategoryEmoji(category.category)}
                      </span>
                      <span className="text-white font-medium capitalize">
                        {category.category.replace("_", " ")}
                      </span>
                    </div>
                  </td>
                  <td className="text-right py-3 text-white font-bold">
                    {formatTime(category.minutes)}
                  </td>
                  <td className="text-right py-3 text-gray-400">
                    {Math.round(category.percentage)}%
                  </td>
                  <td className="text-right py-3 text-blue-400">
                    {(category.minutes / 60).toFixed(1)}h
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-800/50">
        <h3 className="text-lg font-semibold text-white mb-4">
          💡 Advanced Analytics & Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="text-gray-300">
            <p className="font-medium mb-2">📊 Performance Metrics:</p>
            <ul className="space-y-1">
              <li>
                • Peak productivity day:{" "}
                <strong>{formatDate(analyticsData.mostProductiveDay)}</strong>
              </li>
              <li>
                • Daily average:{" "}
                <strong>{formatTime(analyticsData.averageDailyTime)}</strong>
              </li>
              <li>
                • Learning focus:{" "}
                <strong>{analyticsData.productivityScore}%</strong> of total
                time
              </li>
              <li>
                • Total sessions:{" "}
                <strong>{analyticsData.totalActivities}</strong> activities
              </li>
            </ul>
          </div>
          <div className="text-gray-300">
            <p className="font-medium mb-2">🎯 Optimization Tips:</p>
            <ul className="space-y-1">
              <li>• Maintain consistency from your peak days</li>
              <li>• Balance productive vs leisure activities</li>
              <li>• Set specific time goals for each category</li>
              <li>• Review patterns weekly to adjust habits</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
