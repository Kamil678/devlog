import { useSelector } from "react-redux";
import { Outlet, Navigate, useLocation } from "react-router-dom";

export default function OnlyAdminRoute() {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();

  if (!user) return <Navigate to="/sign-in" state={{ from: location.pathname + location.search }} replace />;
  return user.isAdmin ? <Outlet /> : <Navigate to="/dashboard?tab=profile" replace />;
}
