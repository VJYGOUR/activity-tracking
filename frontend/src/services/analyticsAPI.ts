import axiosInstance from "../axios/axiosInstance";
import type { ApiResponse, AnalyticsData } from "../types";

export const analyticsAPI = {
  // Get weekly analytics
  getWeeklyAnalytics: async (): Promise<AnalyticsData> => {
    const response = await axiosInstance.get<ApiResponse<AnalyticsData>>(
      "/analytics/weekly"
    );
    return response.data.data!;
  },

  // Get monthly analytics
  getMonthlyAnalytics: async (): Promise<AnalyticsData> => {
    const response = await axiosInstance.get<ApiResponse<AnalyticsData>>(
      "/analytics/monthly"
    );
    return response.data.data!;
  },

  // Get custom date range analytics
  getDateRangeAnalytics: async (
    startDate: string,
    endDate: string
  ): Promise<AnalyticsData> => {
    const response = await axiosInstance.get<ApiResponse<AnalyticsData>>(
      `/analytics/range?startDate=${startDate}&endDate=${endDate}`
    );
    return response.data.data!;
  },
};
