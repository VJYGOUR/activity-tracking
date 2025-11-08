import express from "express";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import crypto from "crypto";
import User from "../models/user.models.js";
import { protect } from "../middleware/auth.js";

dotenv.config();
const router = express.Router();

// ✅ Initialize Razorpay client
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* -------------------------------------------
   📦 Create Subscription
------------------------------------------- */
router.post("/create", protect, async (req, res) => {
  try {
    const { planId } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: 12,
    });

    user.subscriptionId = subscription.id;
    user.subscriptionStatus = subscription.status;
    await user.save();

    res.status(200).json({
      subscriptionId: subscription.id,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("❌ Subscription creation failed:", error);
    res.status(500).json({ error: "Subscription creation failed" });
  }
});

/* -------------------------------------------
   🧾 Verify Subscription
------------------------------------------- */
router.post("/verify", async (req, res) => {
  const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature } =
    req.body;

  try {
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_payment_id + "|" + razorpay_subscription_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    await User.findOneAndUpdate(
      { subscriptionId: razorpay_subscription_id },
      { plan: "paid", subscriptionStatus: "active" }
    );

    res.json({ success: true });
  } catch (error) {
    console.error("❌ Verification failed:", error);
    res.status(500).json({ message: "Subscription verification failed" });
  }
});

/* -------------------------------------------
   ❌ Cancel Subscription (end of cycle)
------------------------------------------- */
router.post("/cancel", protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || !user.subscriptionId)
      return res.status(404).json({ error: "Subscription not found" });

    const cancelResponse = await razorpay.subscriptions.cancel(
      user.subscriptionId,
      { cancel_at_cycle_end: true }
    );

    user.subscriptionStatus = "cancelled_at_period_end";
    await user.save();

    res.status(200).json({
      success: true,
      message: "Subscription will end after current billing cycle",
      cancelResponse,
    });
  } catch (error) {
    console.error("❌ Error cancelling subscription:", error);
    res.status(500).json({ error: "Failed to cancel subscription" });
  }
});

export default router;
