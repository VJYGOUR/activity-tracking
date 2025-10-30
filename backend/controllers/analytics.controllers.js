import Activity from "../models/activity.models.js";

// Helper function to get analytics data for a date range
const getAnalyticsData = async (userId, startDate, endDate) => {
  const activities = await Activity.find({
    userId,
    date: { $gte: startDate, $lte: endDate },
  }).sort({ date: 1 });

  // Calculate daily data
  const dailyDataMap = new Map();
  const categoryDataMap = new Map();
  let totalMinutes = 0;
  let totalActivities = activities.length;

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

  // Convert maps to arrays
  const dailyData = Array.from(dailyDataMap, ([date, data]) => ({
    date,
    minutes: data.minutes,
    activities: data.activities,
  }));

  const categoryData = Array.from(categoryDataMap, ([category, data]) => ({
    category,
    minutes: data.minutes,
    percentage: totalMinutes > 0 ? (data.minutes / totalMinutes) * 100 : 0,
  }));

  // Calculate productivity score (coding + studying + reading)
  const productiveMinutes = activities
    .filter((activity) =>
      ["coding", "studying", "reading"].includes(activity.category)
    )
    .reduce((sum, activity) => sum + activity.duration, 0);

  const productivityScore =
    totalMinutes > 0 ? Math.round((productiveMinutes / totalMinutes) * 100) : 0;

  // Find most productive day
  const mostProductiveDay =
    dailyData.length > 0
      ? dailyData.reduce(
          (max, day) => (day.minutes > max.minutes ? day : max),
          dailyData[0]
        )
      : null;

  const averageDailyTime =
    dailyData.length > 0 ? Math.round(totalMinutes / dailyData.length) : 0;

  return {
    totalMinutes,
    totalActivities,
    dailyData,
    categoryData: categoryData.sort((a, b) => b.minutes - a.minutes),
    productivityScore,
    averageDailyTime,
    mostProductiveDay: mostProductiveDay ? mostProductiveDay.date : "No data",
  };
};

// @desc    Get weekly analytics
// @route   GET /api/analytics/weekly
// @access  Private
export const getWeeklyAnalytics = async (req, res) => {
  try {
    const userId = req.userId;

    // Get last 7 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6); // Last 7 days including today

    const analyticsData = await getAnalyticsData(
      userId,
      startDate.toISOString().split("T")[0],
      endDate.toISOString().split("T")[0]
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

    // Get last 30 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 29); // Last 30 days including today

    const analyticsData = await getAnalyticsData(
      userId,
      startDate.toISOString().split("T")[0],
      endDate.toISOString().split("T")[0]
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
