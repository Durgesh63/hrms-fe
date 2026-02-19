import { Outlet } from "react-router-dom";
import { NavBar } from "./NavBar";

const Layout = () => {
  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <NavBar />

        <Outlet />
      </div>
    </>
  );
};

export default Layout;
