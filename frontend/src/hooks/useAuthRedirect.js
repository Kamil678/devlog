import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setUser } from "../app/user/userSlice";

export function useAuthRedirect() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  return (user) => {
    dispatch(setUser(user));
    navigate(location.state?.from || (user.isAdmin ? "/dashboard?tab=overview" : "/"), { replace: true });
  };
}
