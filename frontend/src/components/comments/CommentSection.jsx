import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { HiOutlineChatBubbleOvalLeft } from "react-icons/hi2";
import Comment from "./Comment";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import ConfirmDialog from "../ui/ConfirmDialog";
import Skeleton from "../ui/Skeleton";
import { api } from "../../lib/api";
import { useApi } from "../../hooks/useApi";
import { useErrorMessage } from "../../hooks/useErrorMessage";

const MAX_LENGTH = 300;

export default function CommentSection({ postId }) {
  const { t } = useTranslation();
  const errorMessage = useErrorMessage();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.user);
  const { data, loading, setData } = useApi(`/comment/getComments/${postId}`);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const comments = data?.comments ?? [];
  const setComments = (updater) => setData((prev) => ({ ...prev, comments: updater(prev?.comments ?? []) }));

  const requireUser = () => {
    if (user) return true;
    navigate("/sign-in", { state: { from: location.pathname } });
    return false;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      const res = await api("/comment/create", { method: "POST", body: { content: content.trim(), postId } });
      setComments((prev) => [res.comment, ...prev]);
      setContent("");
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const like = async (commentId) => {
    if (!requireUser()) return;
    try {
      const updated = await api(`/comment/like/${commentId}`, { method: "PUT" });
      setComments((prev) => prev.map((c) => (c._id === commentId ? updated : c)));
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const save = async (commentId, newContent) => {
    try {
      const updated = await api(`/comment/edit/${commentId}`, { method: "PUT", body: { content: newContent } });
      setComments((prev) => prev.map((c) => (c._id === commentId ? updated : c)));
      return true;
    } catch (err) {
      toast.error(errorMessage(err));
      return false;
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api(`/comment/delete/${toDelete}`, { method: "DELETE" });
      setComments((prev) => prev.filter((c) => c._id !== toDelete));
      toast.success(t("comments.deleted"));
      setToDelete(null);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="mt-14" aria-labelledby="comments-title">
      <h2 id="comments-title" className="flex items-center gap-2 text-xl font-bold tracking-tight">
        {t("comments.title")}
        <span className="rounded-full bg-gray-100 px-2 py-0.5 font-mono text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          {comments.length}
        </span>
      </h2>

      {user ? (
        <form onSubmit={submit} className="mt-6 rounded-2xl border border-gray-200 p-4 focus-within:border-brand-500 dark:border-gray-800">
          <div className="flex gap-3">
            <Avatar src={user.picture} name={user.username} size="md" />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={MAX_LENGTH}
              rows={3}
              placeholder={t("comments.placeholder")}
              aria-label={t("comments.placeholder")}
              className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-gray-400 focus-visible:ring-0"
            />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="font-mono text-xs text-gray-400">
              {content.length}/{MAX_LENGTH}
            </span>
            <Button type="submit" size="sm" loading={submitting} disabled={!content.trim()}>
              {t("comments.submit")}
            </Button>
          </div>
        </form>
      ) : (
        <div className="mt-6 flex flex-col items-start gap-3 rounded-2xl border border-dashed border-gray-300 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-gray-700">
          <p className="text-sm text-gray-500">{t("comments.signInPrompt")}</p>
          <Button size="sm" to="/sign-in" state={{ from: location.pathname }}>
            {t("nav.signIn")}
          </Button>
        </div>
      )}

      {loading ? (
        <div className="mt-6 space-y-6">
          {[0, 1].map((i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="mt-8 flex flex-col items-center py-6 text-center text-sm text-gray-500">
          <HiOutlineChatBubbleOvalLeft className="mb-2 h-6 w-6" />
          {t("comments.empty")}
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-gray-200 dark:divide-gray-800">
          {comments.map((comment) => (
            <Comment key={comment._id} comment={comment} onLike={like} onSave={save} onDelete={setToDelete} />
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title={t("comments.deleteTitle")}
        description={t("comments.deleteDescription")}
      />

      {user?.isDemo && (
        <p className="mt-4 text-xs text-gray-500">
          {t("demo.readOnlyNote")} <Link to="/sign-up" className="underline">{t("auth.createAccount")}</Link>
        </p>
      )}
    </section>
  );
}
