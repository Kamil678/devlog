import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { api, onUnauthorized } from "../lib/api";
import { setUser, clearUser } from "../app/user/userSlice";

export function useSession() {
  const dispatch = useDispatch();
  const hasUser = useSelector((state) => Boolean(state.user.user));

  useEffect(() => {
    onUnauthorized(() => dispatch(clearUser()));
  }, [dispatch]);

  useEffect(() => {
    if (!hasUser) return;
    api("/auth/me")
      .then((user) => dispatch(setUser(user)))
      .catch((err) => {
        if (err.status === 401) dispatch(clearUser());
      });
  }, []);
}

export function useSignOut() {
  const dispatch = useDispatch();

  return async () => {
    try {
      await api("/auth/signout", { method: "POST" });
    } finally {
      dispatch(clearUser());
    }
  };
}
