import { apiConnector } from "../apiConnector";
import { attendanceEndpoints } from "../apis";

const {
  MARK_ATTENDANCE_API,
  GET_ALL_ATTENDANCE_API,
  GET_TODAY_ATTENDANCE_API,
  GET_ATTENDANCE_BY_EMPLOYEE_API,
  GET_ATTENDANCE_BY_DATE_API,
  DELETE_ATTENDANCE_API,
} = attendanceEndpoints;

// Mark attendance for an employee
export const markAttendanceAPI = async (data) => {
  const response = await apiConnector("POST", MARK_ATTENDANCE_API, data);

  if (!response?.data?.success) {
    throw new Error(response?.data?.message || "Failed to mark attendance");
  }
  return response?.data;
};

// Get all attendance records
export const getAllAttendanceAPI = async () => {
  const response = await apiConnector("GET", GET_ALL_ATTENDANCE_API);

  if (!response?.data?.success) {
    throw new Error(response?.data?.message || "Failed to fetch attendance records");
  }
  return response?.data;
};

// Get today's attendance for specific employee
export const getTodayAttendanceAPI = async (employeeId) => {
  const url = GET_TODAY_ATTENDANCE_API.replace(":employeeId", employeeId);
  const response = await apiConnector("GET", url);

  if (!response?.data?.success) {
    throw new Error(response?.data?.message || "Failed to fetch today's attendance");
  }
  return response?.data;
};

// Get attendance records for specific employee
export const getAttendanceByEmployeeAPI = async (employeeId) => {
  const url = GET_ATTENDANCE_BY_EMPLOYEE_API.replace(":employeeId", employeeId);
  const response = await apiConnector("GET", url);

  if (!response?.data?.success) {
    throw new Error(response?.data?.message || "Failed to fetch employee attendance");
  }
  return response?.data;
};

// Delete attendance record
export const deleteAttendanceAPI = async (attendanceId) => {
  const response = await apiConnector(
    "DELETE",
    `${DELETE_ATTENDANCE_API}/${attendanceId}`
  );

  if (!(response.status === 200)) {
    throw new Error(response?.data?.message || "Failed to delete attendance record");
  }
  return response?.data;
};

// Get attendance records filtered by date range
export const getAttendanceByDateAPI = async (startDate, endDate, employeeId = null) => {
  const params = new URLSearchParams();
  params.append("startDate", startDate);
  params.append("endDate", endDate);
  if (employeeId) {
    params.append("employeeId", employeeId);
  }

  const url = `${GET_ATTENDANCE_BY_DATE_API}?${params.toString()}`;
  const response = await apiConnector("GET", url);

  if (!response?.data?.success) {
    throw new Error(response?.data?.message || "Failed to fetch attendance records by date");
  }
  return response?.data;
};
