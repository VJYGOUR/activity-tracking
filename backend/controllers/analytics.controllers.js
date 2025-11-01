import Activity from "../models/activity.models.js";
import Category from "../models/category.models.js";

// Helper function to format dates without timezone issues
const formatDateForQuery = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Helper function to get analytics data for a date range
const getAnalyticsData = async (userId, startDate, endDate) => {
  // Convert to Date objects for comparison
  const start = new Date(startDate);
  const end = new Date(endDate);

  const activities = await Activity.find({
    userId,
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  }).sort({ date: 1 });

  // Calculate daily data - only for dates within the range
  const dailyDataMap = new Map();
  const categoryDataMap = new Map();
  let totalMinutes = 0;
  let totalActivities = activities.length;

  // Initialize all dates in the range to ensure we have entries for all dates
  const currentDate = new Date(start);
  while (currentDate <= end) {
    const dateStr = currentDate.toISOString().split("T")[0];
    if (!dailyDataMap.has(dateStr)) {
      dailyDataMap.set(dateStr, { minutes: 0, activities: 0 });
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  activities.forEach((activity) => {
    // Daily data
    if (!dailyDataMap.has(activity.date)) {
      dailyDataMap.set(activity.date, { minutes: 0, activities: 0 });
    }
    const dayData = dailyDataMap.get(activity.date);
    dayData.minutes += activity.duration;
    dayData.activities += 1;

    // Category data
    if (!categoryDataMap.has(activity.category)) {
      categoryDataMap.set(activity.category, { minutes: 0 });
    }
    const categoryData = categoryDataMap.get(activity.category);
    categoryData.minutes += activity.duration;

    totalMinutes += activity.duration;
  });

  // Convert maps to arrays and sort by date
  const dailyData = Array.from(dailyDataMap, ([date, data]) => ({
    date,
    minutes: data.minutes,
    activities: data.activities,
  })).sort((a, b) => new Date(a.date) - new Date(b.date));

  const categoryData = Array.from(categoryDataMap, ([category, data]) => ({
    category,
    minutes: data.minutes,
    percentage: totalMinutes > 0 ? (data.minutes / totalMinutes) * 100 : 0,
  }));

  // DYNAMIC productivity calculation - includes default productive + user's productive custom categories
  const userCategories = await Category.find({ userId });

  // Get all productive categories (default + custom)
  const productiveCategories = [
    "coding", // default productive
    "studying", // default productive
    "reading", // default productive
    // Add user's custom productive categories
    ...userCategories.filter((cat) => cat.isProductive).map((cat) => cat.name),
  ];

  const productiveMinutes = activities
    .filter((activity) => productiveCategories.includes(activity.category))
    .reduce((sum, activity) => sum + activity.duration, 0);

  const productivityScore =
    totalMinutes > 0 ? Math.round((productiveMinutes / totalMinutes) * 100) : 0;

  // FIX: Find most productive day - handle case when no activities
  let mostProductiveDayValue = "No activities";
  if (activities.length > 0) {
    const daysWithActivities = dailyData.filter((day) => day.minutes > 0);
    if (daysWithActivities.length > 0) {
      const mostProductiveDay = daysWithActivities.reduce(
        (max, day) => (day.minutes > max.minutes ? day : max),
        daysWithActivities[0]
      );
      mostProductiveDayValue = mostProductiveDay.date;
    }
  }

  const averageDailyTime =
    dailyData.length > 0 ? Math.round(totalMinutes / dailyData.length) : 0;

  return {
    totalMinutes,
    totalActivities,
    dailyData,
    categoryData: categoryData.sort((a, b) => b.minutes - a.minutes),
    productivityScore,
    averageDailyTime,
    mostProductiveDay: mostProductiveDayValue,
  };
};

// @desc    Get weekly analytics
// @route   GET /api/analytics/weekly
// @access  Private
export const getWeeklyAnalytics = async (req, res) => {
  try {
    const userId = req.userId;

    // Get current week (Monday to Sunday)
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Calculate Monday of current week
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    // Calculate Sunday of current week
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    // Format dates properly to avoid timezone issues
    const startDateStr = formatDateForQuery(startDate);
    const endDateStr = formatDateForQuery(endDate);

    const analyticsData = await getAnalyticsData(
      userId,
      startDateStr,
      endDateStr
    );

    res.json({
      success: true,
      data: analyticsData,
    });
  } catch (error) {
    console.error("Get weekly analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get monthly analytics
// @route   GET /api/analytics/monthly
// @access  Private
export const getMonthlyAnalytics = async (req, res) => {
  try {
    const userId = req.userId;

    // Get current month (first day to last day of current month)
    const now = new Date();

    // Get first day of current month
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    // Get last day of current month
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Format dates properly to avoid timezone issues
    const startDateStr = formatDateForQuery(startDate);
    const endDateStr = formatDateForQuery(endDate);

    const analyticsData = await getAnalyticsData(
      userId,
      startDateStr,
      endDateStr
    );

    res.json({
      success: true,
      data: analyticsData,
    });
  } catch (error) {
    console.error("Get monthly analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get custom date range analytics
// @route   GET /api/analytics/range
// @access  Private
export const getDateRangeAnalytics = async (req, res) => {
  try {
    const userId = req.userId;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Start date and end date are required",
      });
    }

    const analyticsData = await getAnalyticsData(userId, startDate, endDate);

    res.json({
      success: true,
      data: analyticsData,
    });
  } catch (error) {
    console.error("Get date range analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
