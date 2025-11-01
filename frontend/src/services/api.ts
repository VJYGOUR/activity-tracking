// services/api.ts
import axiosInstance from "../axios/axiosInstance";
import type {
  ApiResponse,
  ActivityResponse,
  CategoryResponse,
  CreateActivityData,
  CreateCategoryData,
} from "../types/index";

// Activity API
export const activityAPI = {
  getTodayActivities: async (): Promise<ActivityResponse[]> => {
    const response = await axiosInstance.get<ApiResponse<ActivityResponse[]>>(
      "/activities/today"
    );
    return response.data.data || [];
  },

  createActivity: async (
    activityData: CreateActivityData
  ): Promise<ActivityResponse> => {
    const response = await axiosInstance.post<ApiResponse<ActivityResponse>>(
      "/activities",
      activityData
    );
    return response.data.data!;
  },

  getActivitiesByDate: async (date: string): Promise<ActivityResponse[]> => {
    const response = await axiosInstance.get<ApiResponse<ActivityResponse[]>>(
      `/activities?date=${date}`
    );
    return response.data.data || [];
  },

  deleteActivity: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/activities/${id}`);
  },
  getActivitySummary: async (): Promise<{
    totalMinutes: number;
    totalActivities: number;
    categoryTotals: Array<{
      category: string;
      duration: number;
      count: number;
    }>;
    productivityScore: number;
    productiveMinutes: number;
  }> => {
    const response = await axiosInstance.get<
      ApiResponse<{
        totalMinutes: number;
        totalActivities: number;
        categoryTotals: Array<{
          category: string;
          duration: number;
          count: number;
        }>;
        productivityScore: number;
        productiveMinutes: number;
      }>
    >("/activities/summary");
    return response.data.data!;
  },
};

// Categories API
export const categoryAPI = {
  getCategories: async (): Promise<CategoryResponse[]> => {
    const response = await axiosInstance.get<ApiResponse<CategoryResponse[]>>(
      "/categories"
    );
    return response.data.data || [];
  },

  createCategory: async (
    categoryData: CreateCategoryData
  ): Promise<CategoryResponse> => {
    const response = await axiosInstance.post<ApiResponse<CategoryResponse>>(
      "/categories",
      categoryData
    );
    return response.data.data!;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/categories/${id}`);
  },
};
