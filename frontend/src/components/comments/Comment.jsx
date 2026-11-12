import { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { HiHandThumbUp, HiOutlineHandThumbUp } from "react-icons/hi2";
import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { Textarea } from "../ui/Field";
import { usePublicUser } from "../../hooks/usePublicUser";
import { timeAgo } from "../../lib/format";
import { cn } from "../../lib/cn";

export default function Comment({ comment, onLike, onSave, onDelete }) {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.user);
  const author = usePublicUser(comment.userId);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(comment.content);
  const [saving, setSaving] = useState(false);

  const liked = user && comment.likes.includes(user._id);
  const isOwner = user && user._id === comment.userId;
  const authorName = author?.username || t("comments.deletedUser");

  const save = async () => {
    setSaving(true);
    const ok = await onSave(comment._id, draft.trim());
    setSaving(false);
    if (ok) setIsEditing(false);
  };

  return (
    <li className="flex gap-3 py-5">
      <Avatar src={author?.picture} name={authorName} size="md" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-sm font-semibold">{authorName}</span>
          {author?.isAdmin && <Badge tone="brand">{t("comments.author")}</Badge>}
          <time dateTime={comment.createdAt} className="font-mono text-xs text-gray-400">
            {timeAgo(comment.createdAt)}
          </time>
        </div>

        {isEditing ? (
          <div className="mt-2">
            <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} maxLength={300} aria-label={t("comments.edit")} />
            <div className="mt-2 flex justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                {t("common.cancel")}
              </Button>
              <Button size="sm" onClick={save} loading={saving} disabled={!draft.trim()}>
                {t("common.save")}
              </Button>
            </div>
          </div>
        ) : (
          <p className="mt-1 whitespace-pre-line break-words text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
        )}

        {!isEditing && (
          <div className="mt-2 flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => onLike(comment._id)}
              aria-pressed={Boolean(liked)}
              aria-label={t("comments.like")}
              className={cn(
                "inline-flex items-center gap-1 rounded-md px-1.5 py-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800",
                liked ? "text-brand-600 dark:text-brand-400" : "text-gray-500"
              )}
            >
              {liked ? <HiHandThumbUp className="h-4 w-4" /> : <HiOutlineHandThumbUp className="h-4 w-4" />}
              {comment.numberOfLikes > 0 && comment.numberOfLikes}
            </button>
            {isOwner && (
              <button
                type="button"
                onClick={() => {
                  setDraft(comment.content);
                  setIsEditing(true);
                }}
                className="rounded-md px-1.5 py-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                {t("common.edit")}
              </button>
            )}
            {(isOwner || user?.isAdmin) && (
              <button
                type="button"
                onClick={() => onDelete(comment._id)}
                className="rounded-md px-1.5 py-1 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
              >
                {t("common.delete")}
              </button>
            )}
          </div>
        )}
      </div>
    </li>
  );
}
