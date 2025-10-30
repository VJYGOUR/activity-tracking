export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CreateActivityData {
  category: string;
  duration: number;
  notes?: string;
}

export interface ActivityResponse {
  _id: string;
  category: string;
  duration: number;
  date: string;
  notes?: string;
  createdAt: string;
}

export interface CreateCategoryData {
  name: string;
  emoji: string;
  color?: string;
}
export interface CategoryResponse {
  _id?: string; // Add this line
  name: string;
  emoji: string;
  color: string;
  isDefault: boolean;
}

export interface TimeRange {
  startDate: string;
  endDate: string;
  label: string;
}
export interface AnalyticsData {
  totalMinutes: number;
  totalActivities: number;
  dailyData: { date: string; minutes: number; activities: number }[];
  categoryData: { category: string; minutes: number; percentage: number }[];
  productivityScore: number;
  averageDailyTime: number; // Ensure this exists
  mostProductiveDay: string; // Ensure this exists
}

// Recharts compatible types
export interface DailyChartData {
  date: string;
  minutes: number;
  hours: number;
  activities: number;
}

export interface CategoryPieData {
  name: string;
  value: number;
  fill?: string;
}
