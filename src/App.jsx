import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Login from "./components/Login";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import "./App.css";
import PublicRoute from "./PublicRoute";

function App() {
  const dispatch = useDispatch();

  

  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route path="/"  element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />

        <Route path="/employees" element={<Employees />} />

        <Route path="/attendance" element={<Attendance />} />
      </Route>
    </Routes>
  );
}

export default App;
