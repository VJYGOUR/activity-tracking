import React, { useState, useEffect } from "react";
import { analyticsAPI } from "../services/analyticsAPI";

// Remove all recharts imports and use simple divs instead
const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await analyticsAPI.getWeeklyAnalytics();
      setAnalyticsData(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-64">
        Loading...
      </div>
    );
  if (!analyticsData)
    return <div className="text-center py-12">No data available</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-xl">
          <p className="text-gray-400">Total Time</p>
          <p className="text-2xl font-bold text-white">
            {analyticsData.totalMinutes} minutes
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl">
          <p className="text-gray-400">Activities</p>
          <p className="text-2xl font-bold text-white">
            {analyticsData.totalActivities}
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl">
          <p className="text-gray-400">Productivity</p>
          <p className="text-2xl font-bold text-white">
            {analyticsData.productivityScore}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
