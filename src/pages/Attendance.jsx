import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { markAttendanceAPI, getAllAttendanceAPI, getAttendanceByEmployeeAPI, getAttendanceByDateAPI } from '../services/operations/attendanceAPI';
import { getallEmployeeInfo } from '../services/operations/employees';

export default function Attendance() {
  const [showForm, setShowForm] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [filterEmployee, setFilterEmployee] = useState('');
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch employees on mount
  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await getallEmployeeInfo();
      setEmployees(res?.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch employees');
    }
  };

  const fetchAttendance = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllAttendanceAPI();

      setAttendance(res.data.records);
      setFilteredAttendance(res.data.records);
    } catch (err) {
      setError(err.message || 'Failed to fetch attendance records');
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      employeeId: '',
      date: new Date().toISOString().split('T')[0],
      status: 'Present',
    },
    validate: (values) => {
      const errors = {};
      if (!values.employeeId) errors.employeeId = 'Please select an employee';
      if (!values.status) errors.status = 'Please select a status';
      return errors;
    },
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      setLoading(true);
      setError(null);
      try {
        await markAttendanceAPI(values);
        setSuccess(true);
        await fetchAttendance();
      } catch (err) {
        setError(err.message || 'Failed to mark attendance');
      } finally {
        setSubmitting(false);
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (success) {
      formik.resetForm();
      setShowForm(false);
      setSuccess(false);
    }
  }, [success]);

 
  const handleFilterChange = (empId) => {
    setFilterEmployee(empId);
  };

  const handleDateRangeChange = (newStartDate, newEndDate) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  const applyFiltersHandler = async () => {
    await applyFilters(filterEmployee, startDate, endDate);
    setShowFilter(false);
  };

  const resetFiltersHandler = () => {
    setFilterEmployee('');
    setStartDate('');
    setEndDate('');
    setFilteredAttendance(attendance);
    setShowFilter(false);
  };

  const applyFilters = async (empId, start, end) => {
    setLoading(true);
    setError(null);
    try {
      let filteredList = [];

      // Validate dates
      if (start && end && new Date(end) < new Date(start)) {
        setError('End date cannot be before start date');
        setLoading(false);
        return;
      }

      // Apply filters based on what's selected
      if (!empId && !start && !end) {
        // No filters - show all
        filteredList = attendance;
      } else if (empId && start && end) {
        // Both employee and date range selected
        const res = await getAttendanceByDateAPI(start, end, empId);
        filteredList = Array.isArray(res?.data?.records) ? res.data.records : Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      } else if (empId) {
        // Only employee selected
        const res = await getAttendanceByEmployeeAPI(empId);
        filteredList = Array.isArray(res?.data?.records) ? res.data.records : Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      } else if (start && end) {
        // Only date range selected
        const res = await getAttendanceByDateAPI(start, end);
        filteredList = Array.isArray(res?.data?.records) ? res.data.records : Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      }

      setFilteredAttendance(filteredList || []);
    } catch (err) {
      setError(err.message || 'Failed to apply filters');
      setFilteredAttendance(attendance);
    } finally {
      setLoading(false);
    }
  };

  const getEmployeeName = (empId) => {
    const employee = employees.find((emp) => emp.userId === empId);
    return employee ? employee.name : 'Unknown';
  };

  const isPastDate = (dateString) => {
    const selectedDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate < today;
  };

  return (
   
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <h2 className="text-3xl font-bold text-gray-800">Attendance Management</h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
            >
              {showForm ? 'Cancel' : 'Mark Attendance'}
            </button>
          </div>

          {showForm && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Mark Attendance</h3>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              {employees?.length === 0 && (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                  No employees found. Please add employees first.
                </div>
              )}

              {employees?.length > 0 && (
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Employee</label>
                      <select
                        name="employeeId"
                        {...formik.getFieldProps('employeeId')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        disabled={loading || formik.isSubmitting}
                      >
                        <option value="">Select Employee</option>
                        {employees?.map((emp) => (
                          <option key={emp?.userId} value={emp?.userId}>
                            {emp?.name} ({emp?.userId})
                          </option>
                        ))}
                      </select>
                      {formik.touched.employeeId && formik.errors.employeeId && (
                        <div className="text-red-600 text-sm mt-1">{formik.errors.employeeId}</div>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Date</label>
                      <input
                        type="date"
                        name="date"
                        {...formik.getFieldProps('date')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        disabled={loading || formik.isSubmitting}
                      />
                      {formik.touched.date && formik.errors.date && (
                        <div className="text-red-600 text-sm mt-1">{formik.errors.date}</div>
                      )}
                      {formik.values.date && isPastDate(formik.values.date) && (
                        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-3 py-2 rounded mt-2 text-sm">
                          ℹ️ You are marking past attendance
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Status</label>
                      <select
                        name="status"
                        {...formik.getFieldProps('status')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        disabled={loading || formik.isSubmitting}
                      >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                      </select>
                      {formik.touched.status && formik.errors.status && (
                        <div className="text-red-600 text-sm mt-1">{formik.errors.status}</div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || formik.isSubmitting}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                  >
                    {loading || formik.isSubmitting ? 'Marking...' : 'Mark Attendance'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Attendance Records */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800">Attendance Records ({filteredAttendance.length})</h3>
                <button
                  onClick={() => setShowFilter(!showFilter)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
                >
                  {showFilter ? 'Close Filters' : 'Open Filters'}
                </button>
              </div>

              {/* Filter Panel */}
              {showFilter && (
                <div className="bg-white p-5 rounded-xl border border-gray-200 mb-4 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                      <label className="block text-slate-600 font-medium mb-2 text-sm">Employee</label>
                      <select
                        value={filterEmployee}
                        onChange={(e) => handleFilterChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white text-slate-700 text-sm"
                      >
                        <option value="">All Employees</option>
                        {employees?.map((emp) => (
                          <option key={emp?.userId} value={emp?.userId}>
                            {emp?.name} ({emp?.userId})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-medium mb-2 text-sm">Start Date</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => handleDateRangeChange(e.target.value, endDate)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white text-slate-700 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-medium mb-2 text-sm">End Date</label>
                      <input
                        type="date"
                        value={endDate}
                        min={startDate}
                        onChange={(e) => {
                          if (new Date(e.target.value) >= new Date(startDate)) {
                            handleDateRangeChange(startDate, e.target.value);
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white text-slate-700 text-sm"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={applyFiltersHandler}
                        className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200 text-sm"
                      >
                        Apply
                      </button>
                      <button
                        onClick={resetFiltersHandler}
                        className="flex-1 px-4 py-2 bg-slate-300 hover:bg-slate-400 text-slate-700 font-medium rounded-lg transition duration-200 text-sm"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {filteredAttendance?.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No attendance records found. Mark attendance to get started.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-gray-700 font-semibold">Employee</th>
                      <th className="px-6 py-3 text-left text-gray-700 font-semibold">Employee ID</th>
                      <th className="px-6 py-3 text-left text-gray-700 font-semibold">Date</th>
                      <th className="px-6 py-3 text-left text-gray-700 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttendance?.map((record, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-gray-800">{getEmployeeName(record?.employeeId)}</td>
                        <td className="px-6 py-4 text-gray-800">{record?.employeeId}</td>
                        <td className="px-6 py-4 text-gray-800">{record?.date ? new Date(record.date).toLocaleDateString('en-IN') : 'N/A'}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                              record?.status === 'Present'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {record?.status || 'Unknown'}
                          </span>
                        </td>
                        
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
  );
}
