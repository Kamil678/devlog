import { useEffect, useState } from "react";
import { api } from "../lib/api";

const cache = new Map();

export function usePublicUser(userId) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!userId) return;
    if (!cache.has(userId)) {
      cache.set(
        userId,
        api(`/user/${userId}`).catch(() => null)
      );
    }
    let active = true;
    cache.get(userId).then((u) => active && setUser(u));
    return () => {
      active = false;
    };
  }, [userId]);

  return user;
}
