import express from "express";
import {
  getWeeklyAnalytics,
  getMonthlyAnalytics,
  getDateRangeAnalytics,
} from "../controllers/analytics.controllers.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/weekly", getWeeklyAnalytics);
router.get("/monthly", getMonthlyAnalytics);
router.get("/range", getDateRangeAnalytics);

export default router;
