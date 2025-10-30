import express from "express";
import {
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} from "../controllers/category.controllers.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// All routes are protected
router.use(protect);

router.get("/", getCategories);
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
