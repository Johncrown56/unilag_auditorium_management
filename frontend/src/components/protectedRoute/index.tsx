/* eslint-disable */
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "../layout";
import { RootState } from "../../store/store";

const ProtectedRoute = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  return user != null ? (
    <Layout />
  ) : (
    <Navigate to="/login" replace state={{ from: location?.pathname }} />
  );
};

export default ProtectedRoute;
