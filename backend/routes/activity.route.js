import express from "express";
import {
  createActivity,
  getTodayActivities,
  getActivitiesByDate,
  deleteActivity,
  getActivitySummary,
} from "../controllers/activity.controllers.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// All routes are protected
router.use(protect);

router.post("/", createActivity);
router.get("/today", getTodayActivities);
router.get("/summary", getActivitySummary);
router.get("/", getActivitiesByDate);
router.delete("/:id", deleteActivity);

export default router;
