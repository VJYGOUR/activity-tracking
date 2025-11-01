import Activity from "../models/activity.models.js";
import Category from "../models/category.models.js";

// @desc    Create a new activity
// @route   POST /api/activities
// @access  Private
export const createActivity = async (req, res) => {
  try {
    const { category, duration, notes, date } = req.body;
    const userId = req.userId;
    console.log("user id=", userId);

    // Validate required fields
    if (!category || !duration) {
      return res.status(400).json({
        success: false,
        message: "Category and duration are required",
      });
    }

    // Validate duration
    if (duration < 1) {
      return res.status(400).json({
        success: false,
        message: "Duration must be at least 1 minute",
      });
    }

    // Use today's date if not provided
    const activityDate = date || new Date().toISOString().split("T")[0];

    // Create activity
    const activity = new Activity({
      userId,
      category: category.toLowerCase(),
      duration: Math.round(duration), // Ensure integer minutes
      date: activityDate,
      notes: notes?.trim(),
    });

    await activity.save();

    // Populate with user data if needed
    await activity.populate("userId", "name email");

    res.status(201).json({
      success: true,
      message: "Activity created successfully",
      data: activity,
    });
  } catch (error) {
    console.error("Create activity error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get today's activities for user
// @route   GET /api/activities/today
// @access  Private
export const getTodayActivities = async (req, res) => {
  try {
    const userId = req.userId;
    const today = new Date().toISOString().split("T")[0];

    const activities = await Activity.find({
      userId,
      date: today,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: activities,
      total: activities.length,
    });
  } catch (error) {
    console.error("Get today activities error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get activities by date
// @route   GET /api/activities
// @access  Private
export const getActivitiesByDate = async (req, res) => {
  try {
    const userId = req.userId;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date parameter is required",
      });
    }

    const activities = await Activity.find({
      userId,
      date,
    }).sort({ createdAt: -1 });

    // Calculate totals
    const totalMinutes = activities.reduce(
      (sum, activity) => sum + activity.duration,
      0
    );
    const categoryBreakdown = activities.reduce((acc, activity) => {
      const existing = acc.find((item) => item.category === activity.category);
      if (existing) {
        existing.duration += activity.duration;
      } else {
        acc.push({
          category: activity.category,
          duration: activity.duration,
          count: 1,
        });
      }
      return acc;
    }, []);

    res.json({
      success: true,
      data: activities,
      summary: {
        totalActivities: activities.length,
        totalMinutes,
        totalHours: (totalMinutes / 60).toFixed(1),
        categoryBreakdown,
      },
    });
  } catch (error) {
    console.error("Get activities by date error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Delete an activity
// @route   DELETE /api/activities/:id
// @access  Private
export const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const activity = await Activity.findOne({ _id: id, userId });

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    await Activity.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Activity deleted successfully",
    });
  } catch (error) {
    console.error("Delete activity error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get activity summary (for dashboard)
// @route   GET /api/activities/summary
// @access  Private
export const getActivitySummary = async (req, res) => {
  try {
    const userId = req.userId;
    const today = new Date().toISOString().split("T")[0];

    // Get today's activities
    const todayActivities = await Activity.find({ userId, date: today });

    // Calculate totals
    const totalMinutes = todayActivities.reduce(
      (sum, activity) => sum + activity.duration,
      0
    );

    // Category breakdown
    const categoryTotals = todayActivities.reduce((acc, activity) => {
      const existing = acc.find((item) => item.category === activity.category);
      if (existing) {
        existing.duration += activity.duration;
        existing.count += 1;
      } else {
        acc.push({
          category: activity.category,
          duration: activity.duration,
          count: 1,
        });
      }
      return acc;
    }, []);

    // Sort by duration (descending)
    categoryTotals.sort((a, b) => b.duration - a.duration);

    // DYNAMIC productivity calculation
    const userCategories = await Category.find({ userId });
    const productiveCategories = [
      "coding",
      "studying",
      "reading",
      ...userCategories
        .filter((cat) => cat.isProductive)
        .map((cat) => cat.name),
    ];

    const productiveMinutes = todayActivities
      .filter((activity) => productiveCategories.includes(activity.category))
      .reduce((sum, activity) => sum + activity.duration, 0);

    const productivityScore =
      totalMinutes > 0
        ? Math.round((productiveMinutes / totalMinutes) * 100)
        : 0;

    res.json({
      success: true,
      data: {
        totalMinutes,
        totalActivities: todayActivities.length,
        categoryTotals,
        productivityScore,
        productiveMinutes,
      },
    });
  } catch (error) {
    console.error("Get activity summary error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
