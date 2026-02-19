import { apiConnector } from "../apiConnector";
import { employeeEndpoints } from "../apis";

const {
  GET_ALL_EMPLOYEES_API,
  GET_EMPLOYEE_DETAILS_ID_API,
  ADD_EMPLOYEE_API,
  DELETE_EMPLOYEE_API,
} = employeeEndpoints;


export const DeleteEmployeeToken = async (ID) => {
  const response = await apiConnector(
    "DELETE",
    `${DELETE_EMPLOYEE_API}/${ID}`,
  );

  if (!(response.status === 200)) {
    throw new Error(response?.data?.message);
  }
  return response?.data;
};

export const AddEmployeeAPI = async (data) => {
  const response = await apiConnector("POST", ADD_EMPLOYEE_API, data);

  if (!response?.data?.success) {
    throw new Error(response?.data?.message);
  }
  return response?.data;
};

export const getallEmployeeInfo = async () => {
  const response = await apiConnector("GET", GET_ALL_EMPLOYEES_API);

  if (!response?.data?.success) {
    throw new Error(response?.data?.message);
  }
  return response?.data;
};
