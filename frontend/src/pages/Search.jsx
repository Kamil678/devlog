import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HiMagnifyingGlass, HiOutlineFaceFrown } from "react-icons/hi2";
import PostCard, { PostCardSkeleton } from "../components/posts/PostCard";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import PageHeader from "../components/ui/PageHeader";
import { Input, Select } from "../components/ui/Field";
import Seo from "../components/ui/Seo";
import { api, toQuery } from "../lib/api";
import { useApi } from "../hooks/useApi";

const PAGE_SIZE = 9;

export default function Search() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const searchTerm = params.get("searchTerm") || "";
  const order = params.get("order") || "desc";
  const category = params.get("category") || "";

  const [term, setTerm] = useState(searchTerm);
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const { data: categoryData } = useApi("/post/categories");

  useEffect(() => setTerm(searchTerm), [searchTerm]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    api(`/post/getposts${toQuery({ searchTerm, order, category, limit: PAGE_SIZE })}`, { signal: controller.signal })
      .then((data) => {
        setPosts(data.posts);
        setTotal(data.totalPosts);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setLoading(false);
      });
    return () => controller.abort();
  }, [searchTerm, order, category]);

  const update = (changes) => {
    navigate(`/search${toQuery({ searchTerm, order, category, ...changes })}`);
  };

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const data = await api(`/post/getposts${toQuery({ searchTerm, order, category, limit: PAGE_SIZE, startIndex: posts.length })}`);
      setPosts((prev) => [...prev, ...data.posts]);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="container-page py-12">
      <Seo title={t("search.pageTitle")} />
      <PageHeader eyebrow={t("search.eyebrow")} title={t("search.pageTitle")} description={t("search.pageDescription")} />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          update({ searchTerm: term.trim() });
        }}
        className="mt-8 grid gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-3 sm:grid-cols-[1fr_180px_160px_auto] dark:border-gray-800 dark:bg-gray-900/50"
      >
        <Input
          icon={HiMagnifyingGlass}
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder={t("search.placeholder")}
          aria-label={t("search.placeholder")}
        />
        <Select value={category} onChange={(e) => update({ category: e.target.value })} aria-label={t("search.category")}>
          <option value="">{t("search.allCategories")}</option>
          {categoryData?.categories?.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        <Select value={order} onChange={(e) => update({ order: e.target.value })} aria-label={t("search.sort")}>
          <option value="desc">{t("search.newest")}</option>
          <option value="asc">{t("search.oldest")}</option>
        </Select>
        <Button type="submit">{t("search.submit")}</Button>
      </form>

      <p className="mt-6 font-mono text-xs text-gray-500" aria-live="polite">
        {!loading && t("search.resultsCount", { count: total })}
      </p>

      <div className="mt-4">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <EmptyState
            icon={HiOutlineFaceFrown}
            title={t("search.emptyTitle")}
            description={t("search.emptyDescription")}
            action={
              <Button variant="secondary" to="/search">
                {t("search.clear")}
              </Button>
            }
          />
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            {posts.length < total && (
              <div className="mt-10 flex justify-center">
                <Button variant="secondary" onClick={loadMore} loading={loadingMore}>
                  {t("common.loadMore")}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
