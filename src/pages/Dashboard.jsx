import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEmployeeDashboardStats } from "../services/operations/dashboardAPI";

export default function Dashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalAttendance, setTotalAttendance] = useState(0);
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);
  const [todayStats, setTodayStats] = useState({ marked: 0, present: 0, absent: 0, pending: 0 });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getEmployeeDashboardStats();
      console.log(response);
      
      setTotalEmployees(response.data?.totalEmployees || 0);
      setTotalAttendance(response.data?.totalAttendance || 0);
      setPresentCount(response.data?.presentCount || 0);
      setAbsentCount(response.data?.absentCount || 0);
      setTodayStats(response.data?.today || { marked: 0, present: 0, absent: 0, pending: 0 });
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard stats');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };



  return (
    

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">Dashboard</h2>

          {loading && (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500 text-lg">Loading dashboard stats...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {!loading && (
            <>
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Total Employees</p>
                      <p className="text-4xl font-bold text-blue-600">
                        {totalEmployees}
                      </p>
                    </div>
                    <div className="text-5xl text-blue-200">👥</div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Total Attendance</p>
                      <p className="text-4xl font-bold text-green-600">
                        {totalAttendance}
                      </p>
                    </div>
                    <div className="text-5xl text-green-200">📋</div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Present Today</p>
                      <p className="text-4xl font-bold text-emerald-600">
                        {presentCount}
                      </p>
                    </div>
                    <div className="text-5xl text-emerald-200">✓</div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Absent Today</p>
                      <p className="text-4xl font-bold text-red-600">{absentCount}</p>
                    </div>
                    <div className="text-5xl text-red-200">✗</div>
                  </div>
                </div>
              </div>

              {/* Today's Attendance Summary */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Today's Attendance Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="text-gray-500 text-sm">Marked</p>
                    <p className="text-3xl font-bold text-blue-600">{todayStats.marked}</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <p className="text-gray-500 text-sm">Present</p>
                    <p className="text-3xl font-bold text-green-600">{todayStats.present}</p>
                  </div>
                  <div className="border-l-4 border-red-500 pl-4">
                    <p className="text-gray-500 text-sm">Absent</p>
                    <p className="text-3xl font-bold text-red-600">{todayStats.absent}</p>
                  </div>
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <p className="text-gray-500 text-sm">Pending</p>
                    <p className="text-3xl font-bold text-yellow-600">{todayStats.pending}</p>
                  </div>
                </div>
              </div>

              {/* Quick Action Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  onClick={() => navigate("/employees")}
                  className="bg-blue-500 text-white rounded-lg shadow-lg p-8 cursor-pointer hover:bg-blue-600 transition duration-200"
                >
                  <h3 className="text-2xl font-bold mb-4">Manage Employees</h3>
                  <p className="mb-4">
                    Add, view, or delete employees from the system
                  </p>
                  <button className="bg-white text-blue-600 py-2 px-4 rounded font-bold hover:bg-gray-100 transition">
                    Go to Employees →
                  </button>
                </div>

                <div
                  onClick={() => navigate("/attendance")}
                  className="bg-green-500 text-white rounded-lg shadow-lg p-8 cursor-pointer hover:bg-green-600 transition duration-200"
                >
                  <h3 className="text-2xl font-bold mb-4">Track Attendance</h3>
                  <p className="mb-4">
                    Mark and view attendance records for employees
                  </p>
                  <button className="bg-white text-green-600 py-2 px-4 rounded font-bold hover:bg-gray-100 transition">
                    Go to Attendance →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
  );
}
