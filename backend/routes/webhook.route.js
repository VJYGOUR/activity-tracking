import express from "express";
import crypto from "crypto";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import User from "../models/user.models.js";

dotenv.config();
const router = express.Router();

/**
 * Razorpay Webhook
 */
router.post(
  "/razorpay",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
      const signature = req.headers["x-razorpay-signature"];

      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(req.body)
        .digest("hex");

      if (expectedSignature !== signature) {
        console.log("⚠️ Invalid Razorpay webhook signature");
        return res.status(400).json({ success: false });
      }

      const payload = JSON.parse(req.body.toString());
      const event = payload.event;
      const subscription = payload.payload?.subscription?.entity;

      console.log("📩 Razorpay webhook event:", event);

      switch (event) {
        case "subscription.activated":
          await updateSubscription(subscription, "active");
          break;
        case "subscription.paused":
        case "subscription.halted":
          await updateSubscription(subscription, "paused");
          break;
        case "subscription.cancelled":
          await updateSubscription(subscription, "cancelled");
          break;
        case "subscription.completed":
          await updateSubscription(subscription, "completed");
          break;
        default:
          console.log("⚠️ Unhandled event:", event);
      }

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("❌ Webhook processing failed:", error);
      res.status(500).json({ success: false });
    }
  }
);

async function updateSubscription(subscription, status) {
  try {
    const user = await User.findOne({ subscriptionId: subscription.id });
    if (user) {
      user.subscriptionStatus = status;

      if (status === "cancelled" || status === "completed") {
        user.plan = "free";
        user.subscriptionId = null;
      }

      if (subscription.current_end) {
        user.subscriptionExpiresAt = new Date(subscription.current_end * 1000);
      }

      await user.save();
      console.log(`✅ Subscription ${subscription.id} updated to ${status}`);
    }
  } catch (err) {
    console.error("❌ Error updating subscription:", err);
  }
}

export default router;
