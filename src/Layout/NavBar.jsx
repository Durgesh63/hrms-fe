import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logOut } from "../redux/reducer/auth.slice";

export const NavBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);    
  const handleLogout = () => {
    navigate("/login");
    dispatch(logOut());
  };

  return (
    <div>
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold">HRMS</h1>
            <div className="space-x-4 hidden md:flex">
              <button
                onClick={() => navigate("/")}
                className="py-2 px-4 rounded transition duration-200 hover:bg-blue-500"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate("/employees")}
                className="py-2 px-4 rounded transition duration-200 hover:bg-blue-500"
              >
                Employees
              </button>
              <button
                onClick={() => navigate("/attendance")}
                className="py-2 px-4 rounded transition duration-200 hover:bg-blue-500"
              >
                Attendance
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm">Welcome, {userInfo?.email}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 py-2 px-4 rounded font-bold transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden bg-blue-500 px-6 py-3 flex space-x-2">
          <button
            onClick={() => navigate("/")}
            className="flex-1 py-2 px-3 rounded text-sm transition duration-200 hover:bg-blue-400"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate("/employees")}
            className="flex-1 py-2 px-3 rounded text-sm transition duration-200 hover:bg-blue-400"
          >
            Employees
          </button>
          <button
            onClick={() => navigate("/attendance")}
            className="flex-1 py-2 px-3 rounded text-sm transition duration-200 hover:bg-blue-400"
          >
            Attendance
          </button>
        </div>
      </nav>
    </div>
  );
};
