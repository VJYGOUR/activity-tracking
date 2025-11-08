import React, { useState } from "react";
import { useAuth } from "../utils/AuthContext";
import axiosInstance from "../axios/axiosInstance";

// Razorpay types
interface RazorpayHandlerResponse {
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  subscription_id: string;
  name: string;
  description: string;
  handler: (response: RazorpayHandlerResponse) => Promise<void>;
  prefill: {
    name?: string;
    email?: string;
  };
  theme: {
    color: string;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
  }
}

const SubscriptionPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (): Promise<void> => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post("/subscription/create", {
        planId: "plan_RdISqvZ1zEvnfu", // Your Razorpay plan ID
      });

      const options: RazorpayOptions = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID as string,
        subscription_id: data.subscriptionId,
        name: "LogTaskr Pro",
        description: "Unlock premium productivity tools",
        handler: async (response: RazorpayHandlerResponse) => {
          try {
            await axiosInstance.post("/subscription/verify", response);
            await refreshUser();
            alert("🎉 Subscription successful! Welcome to LogTaskr Pro!");
          } catch (error) {
            console.error("Verification failed:", error);
            alert("Subscription verification failed. Contact support.");
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: "#4f46e5",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error(error);
      alert("Failed to start subscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
        Choose Your Plan
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
        {/* Free Plan Card */}
        <div className="border border-gray-200 rounded-2xl shadow-lg p-8 flex flex-col justify-between bg-white hover:shadow-2xl transition-shadow">
          <div>
            <h2 className="text-2xl font-bold mb-2">Free</h2>
            <p className="text-gray-500 mb-6">
              Basic tracking features to get you started
            </p>
            <div className="text-4xl font-extrabold mb-6 text-gray-900">₹0</div>
            <ul className="space-y-2 text-gray-600 mb-6">
              <li>✅ Basic analytics</li>
              <li>✅ Limited activity history</li>
              <li>✅ Basic categories</li>
            </ul>
          </div>
          {user?.plan === "free" ? (
            <span className="inline-block text-center py-3 px-6 rounded-lg font-semibold border border-indigo-600 text-indigo-600">
              Current Plan
            </span>
          ) : (
            <span className="inline-block text-center py-3 px-6 rounded-lg font-semibold border border-gray-300 text-gray-600 cursor-not-allowed">
              Free
            </span>
          )}
        </div>

        {/* Pro Plan Card */}
        <div className="border border-indigo-600 rounded-2xl shadow-2xl p-8 flex flex-col justify-between bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div>
            <h2 className="text-2xl font-bold mb-2">Pro</h2>
            <p className="text-indigo-200 mb-6">
              Advanced features to supercharge your productivity
            </p>
            <div className="text-4xl font-extrabold mb-6">₹100</div>
            <ul className="space-y-2 mb-6">
              <li>✅ Unlimited analytics</li>
              <li>✅ Full activity history</li>
              <li>✅ Custom categories</li>
              <li>✅ Priority support</li>
              <li>✅ Multi-device access</li>
            </ul>
          </div>
          {user?.plan === "paid" ? (
            <span className="inline-block text-center py-3 px-6 rounded-lg font-semibold border border-white bg-white text-indigo-600 cursor-not-allowed">
              Already Subscribed
            </span>
          ) : (
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full py-3 px-6 rounded-lg font-semibold bg-white text-indigo-600 hover:bg-gray-100 transition-all disabled:opacity-50"
            >
              {loading ? "Processing..." : "Subscribe Now"}
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <p className="text-gray-500 mt-8 text-center max-w-md">
        Start with the Free plan and upgrade anytime to unlock Pro features.
      </p>
    </div>
  );
};

export default SubscriptionPage;
