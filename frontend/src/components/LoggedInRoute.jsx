import { useSelector } from "react-redux";
import { Outlet, Navigate, useLocation } from "react-router-dom";

export default function LoggedInRoute() {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();

  return user ? <Outlet /> : <Navigate to="/sign-in" replace state={{ from: location.pathname + location.search }} />;
}
