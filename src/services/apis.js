const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8080/api/v1"
    : "http://localhost:4000/api/v1";


export const authEndpoints = {
  SIGN_IN_API: `${BASE_URL}/auth/login`,
  LOGOUT_API: `${BASE_URL}/auth/logout`,
  GENRATE_ACCESS_TOKEN_API: `${BASE_URL}/auth/verify-token`,
  SIGN_IN_USER_INFO_API: `${BASE_URL}/auth/user`,
  
};



export const dashboardEndPoint = {
  GET_EMPLOYEE_DASHBOARD_API: `${BASE_URL}/employee/dashboard`,
};


export const employeeEndpoints = {
  GET_ALL_EMPLOYEES_API: `${BASE_URL}/employee/all`,
  GET_EMPLOYEE_DETAILS_ID_API: `${BASE_URL}/employee`,
  ADD_EMPLOYEE_API: `${BASE_URL}/employee/add`,
  DELETE_EMPLOYEE_API: `${BASE_URL}/employee/delete`,
};

export const attendanceEndpoints = {
  MARK_ATTENDANCE_API: `${BASE_URL}/attendance/mark`,
  GET_ALL_ATTENDANCE_API: `${BASE_URL}/attendance`,
  GET_TODAY_ATTENDANCE_API: `${BASE_URL}/attendance/:employeeId/today`,
  GET_ATTENDANCE_BY_EMPLOYEE_API: `${BASE_URL}/attendance/:employeeId`,
  GET_ATTENDANCE_BY_DATE_API: `${BASE_URL}/attendance/filter/by-date`,
  DELETE_ATTENDANCE_API: `${BASE_URL}/attendance`,
};


