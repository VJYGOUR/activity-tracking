import React, { useState } from "react";
import axiosInstance from "../axios/axiosInstance";

const ManageSubscription: React.FC = () => {
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancel = async (): Promise<void> => {
    try {
      setIsCancelling(true);
      const { data } = await axiosInstance.post("/subscription/cancel");
      alert(data.message || "Subscription cancelled");
    } catch (error) {
      console.error(error);
      alert("Failed to cancel subscription");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-semibold mb-4">Manage Subscription</h1>
      <button
        onClick={handleCancel}
        disabled={isCancelling}
        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
      >
        {isCancelling ? "Cancelling..." : "Cancel Plan"}
      </button>
    </div>
  );
};

export default ManageSubscription;
