import { useCallback, useEffect, useState } from "react";
import { api, toQuery } from "../lib/api";

export function usePaginated(path, listKey, totalKey, params = {}, pageSize = 10) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const paramsKey = JSON.stringify(params);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    api(`${path}${toQuery({ ...JSON.parse(paramsKey), limit: pageSize })}`, { signal: controller.signal })
      .then((data) => {
        setItems(data[listKey]);
        setTotal(data[totalKey]);
        setLoading(false);
      })
      .catch((err) => err.name !== "AbortError" && setLoading(false));
    return () => controller.abort();
  }, [path, listKey, totalKey, paramsKey, pageSize]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const data = await api(`${path}${toQuery({ ...params, limit: pageSize, startIndex: items.length })}`);
      setItems((prev) => [...prev, ...data[listKey]]);
    } finally {
      setLoadingMore(false);
    }
  };

  const remove = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item._id !== id));
    setTotal((prev) => prev - 1);
  }, []);

  return { items, total, loading, loadingMore, hasMore: items.length < total, loadMore, remove };
}
