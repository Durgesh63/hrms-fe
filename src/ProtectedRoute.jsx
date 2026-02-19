import { Navigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { loginUserInfo } from "./services/operations/authAPI";
import { useDispatch } from "react-redux";
import { userInfo } from "./redux/reducer/auth.slice";
import Layout from "./Layout/Layout";

const ProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
 
  const dispatch = useDispatch();

  const didInitialVerifyRef = useRef(false);

  const verifyUser = useCallback(async () => {
    try {
      const response = await loginUserInfo();
      const userData = response.data.data;
      dispatch(userInfo(userData));
      setAuthorized(true);
    } catch (error) {
      console.error("Authentication error:", error);
      setAuthorized(false);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);
  
    useEffect(() => {
    if (didInitialVerifyRef.current) return;
    didInitialVerifyRef.current = true;
    verifyUser();
  }, [verifyUser]);


  if (loading) return <div>Loading...</div>;

  return authorized ? <Layout /> : <Navigate to="/login" />;
};

export default ProtectedRoute;