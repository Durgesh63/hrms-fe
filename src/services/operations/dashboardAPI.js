import { apiConnector } from "../apiConnector";

import {
  dashboardEndPoint,
} from "../apis";

const {
  GET_EMPLOYEE_DASHBOARD_API,
} = dashboardEndPoint;

export const getEmployeeDashboardStats = async () => {
  try {
    const response = await apiConnector("GET", GET_EMPLOYEE_DASHBOARD_API);
    
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Failed to fetch dashboard stats");
    }
    return response?.data;
  } catch (error) {
    console.error("Error fetching employee dashboard stats:", error);
    throw error;
  }
};