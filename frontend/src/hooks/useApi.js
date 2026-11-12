import { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api";

export function useApi(path) {
  const [state, setState] = useState({ data: null, loading: Boolean(path), error: null });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!path) return;
    const controller = new AbortController();
    setState((prev) => ({ ...prev, loading: true, error: null }));
    api(path, { signal: controller.signal })
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((error) => {
        if (error.name !== "AbortError") setState({ data: null, loading: false, error });
      });
    return () => controller.abort();
  }, [path, version]);

  const refetch = useCallback(() => setVersion((v) => v + 1), []);
  const setData = useCallback((updater) => setState((prev) => ({ ...prev, data: updater(prev.data) })), []);

  return { ...state, refetch, setData };
}
