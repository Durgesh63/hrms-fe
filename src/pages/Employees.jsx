import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AddEmployeeAPI, getallEmployeeInfo, DeleteEmployeeToken } from '../services/operations/employees';
import { useFormik } from 'formik';

export default function Employees() {
  const [showForm, setShowForm] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Local state instead of redux for employees
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchEmployees()
  }, []);

  const formik = useFormik({
    initialValues: { name: '', email: '', department: '' },
    validate: (values) => {
      const errors = {};
      if (!values.name) errors.name = 'Required';
      if (!values.email) {
        errors.email = 'Required';
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
      }
      if (!values.department) errors.department = 'Required';
      return errors;
    },
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      setLoading(true);
      setError(null);
      try {
        const res = await AddEmployeeAPI(values);
        // Refresh list after successful add
        await fetchEmployees();
        setSuccess(true);
        setShowForm(false);
      } catch (err) {
        setError(err.message || 'Failed to add employee');
      } finally {
        setSubmitting(false);
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (success) {
      formik.resetForm();
      setSuccess(false);
    }
  }, [success]);

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getallEmployeeInfo();      
      setEmployees(res?.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async (empId) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    setLoading(true);
    setError(null);
    try {
      await DeleteEmployeeToken(empId);
      fetchEmployees();
    } catch (err) {
      setError(err.message || 'Failed to delete employee');
    } finally {
      setLoading(false);
    }
  };



  return (
    

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <h2 className="text-3xl font-bold text-gray-800">Employee Management</h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
            >
              {showForm ? 'Cancel' : 'Add Employee'}
            </button>
          </div>

          {showForm && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Add New Employee</h3>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Employee ID removed from the form - backend will generate it */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      {...formik.getFieldProps('name')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="John Doe"
                      disabled={loading || formik.isSubmitting}
                    />
                    {formik.touched.name && formik.errors.name && (
                      <div className="text-red-600 text-sm mt-1">{formik.errors.name}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      {...formik.getFieldProps('email')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="john@example.com"
                      disabled={loading || formik.isSubmitting}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <div className="text-red-600 text-sm mt-1">{formik.errors.email}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Department</label>
                    <select
                      name="department"
                      {...formik.getFieldProps('department')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      disabled={loading || formik.isSubmitting}
                    >
                      <option value="">Select Department</option>
                      <option value="HR">HR</option>
                      <option value="IT">IT</option>
                      <option value="Finance">Finance</option>
                      <option value="Sales">Sales</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Operations">Operations</option>
                    </select>
                    {formik.touched.department && formik.errors.department && (
                      <div className="text-red-600 text-sm mt-1">{formik.errors.department}</div>
                    )}
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={loading || formik.isSubmitting}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                  onClick={formik.handleSubmit}
                >
                  {loading || formik.isSubmitting ? 'Adding...' : 'Add Employee'}
                </button>
              </form>
            </div>
          )}

          {/* Employee List */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800">All Employees ({employees.length})</h3>
            </div>

            {employees.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No employees found. Add a new employee to get started.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-gray-700 font-semibold">Employee ID</th>
                      <th className="px-6 py-3 text-left text-gray-700 font-semibold">Full Name</th>
                      <th className="px-6 py-3 text-left text-gray-700 font-semibold">Email</th>
                      <th className="px-6 py-3 text-left text-gray-700 font-semibold">Department</th>
                      <th className="px-6 py-3 text-left text-gray-700 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((employee, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-gray-800">{employee.userId}</td>
                        <td className="px-6 py-4 text-gray-800">{employee.name}</td>
                        <td className="px-6 py-4 text-gray-800">{employee.email}</td>
                        <td className="px-6 py-4">
                          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            {employee.department}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDeleteEmployee(employee.userId)}
                            disabled={loading}
                            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-1 px-4 rounded transition duration-200"
                          >
                            Delete
                          </button>
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
