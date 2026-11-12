import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HiMagnifyingGlass } from "react-icons/hi2";
import Modal from "../ui/Modal";
import { api, toQuery } from "../../lib/api";
import { formatDate } from "../../lib/format";

export default function SearchDialog({ open, onClose }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!open) setTerm("");
  }, [open]);

  useEffect(() => {
    if (term.trim().length < 2) {
      setResults([]);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(() => {
      api(`/post/getposts${toQuery({ searchTerm: term.trim(), limit: 5 })}`, { signal: controller.signal })
        .then((data) => setResults(data.posts))
        .catch(() => {});
    }, 200);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [term]);

  const go = (path) => {
    onClose();
    navigate(path);
  };

  const submit = (e) => {
    e.preventDefault();
    go(`/search${toQuery({ searchTerm: term.trim() })}`);
  };

  return (
    <Modal open={open} onClose={onClose} title={t("search.title")} position="top" className="max-w-xl p-0">
      <form onSubmit={submit} className="flex items-center gap-3 border-b border-gray-200 px-4 dark:border-gray-800">
        <HiMagnifyingGlass className="h-5 w-5 shrink-0 text-gray-400" />
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder={t("search.placeholder")}
          aria-label={t("search.placeholder")}
          className="h-14 w-full bg-transparent pr-8 text-base outline-none placeholder:text-gray-400 focus-visible:ring-0"
        />
      </form>
      <div className="max-h-80 overflow-y-auto p-2">
        {results.length > 0 ? (
          results.map((post) => (
            <button
              key={post._id}
              type="button"
              onClick={() => go(`/post/${post.slug}`)}
              className="flex w-full items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-left hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <span className="truncate text-sm font-medium">{post.title}</span>
              <span className="shrink-0 font-mono text-xs text-gray-400">{formatDate(post.createdAt)}</span>
            </button>
          ))
        ) : (
          <p className="px-3 py-6 text-center text-sm text-gray-500">
            {term.trim().length < 2 ? t("search.hint") : t("search.noQuickResults")}
          </p>
        )}
      </div>
      <div className="flex items-center justify-between border-t border-gray-200 px-4 py-2.5 text-xs text-gray-500 dark:border-gray-800">
        <span>
          <kbd className="rounded border border-gray-200 px-1.5 py-0.5 font-mono dark:border-gray-700">Enter</kbd> {t("search.seeAll")}
        </span>
        <span>
          <kbd className="rounded border border-gray-200 px-1.5 py-0.5 font-mono dark:border-gray-700">Esc</kbd> {t("common.close")}
        </span>
      </div>
    </Modal>
  );
}
