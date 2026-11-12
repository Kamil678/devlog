import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { HiOutlineHandThumbUp, HiOutlineTrash } from "react-icons/hi2";
import DataTable from "./DataTable";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import ConfirmDialog from "../ui/ConfirmDialog";
import { api } from "../../lib/api";
import { timeAgo } from "../../lib/format";
import { usePaginated } from "../../hooks/usePaginated";
import { usePublicUser } from "../../hooks/usePublicUser";
import { useErrorMessage } from "../../hooks/useErrorMessage";

function CommentAuthor({ userId }) {
  const { t } = useTranslation();
  const user = usePublicUser(userId);
  const name = user?.username || t("comments.deletedUser");
  return (
    <div className="flex items-center gap-2 whitespace-nowrap">
      <Avatar src={user?.picture} name={name} size="sm" />
      {name}
    </div>
  );
}

export default function CommentsTab() {
  const { t } = useTranslation();
  const errorMessage = useErrorMessage();
  const list = usePaginated("/comment/getComments", "comments", "totalComments");
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api(`/comment/delete/${toDelete}`, { method: "DELETE" });
      list.remove(toDelete);
      toast.success(t("comments.deleted"));
      setToDelete(null);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { key: "content", label: t("dashboard.comment"), render: (c) => <p className="line-clamp-2 min-w-[240px]">{c.content}</p> },
    { key: "userId", label: t("dashboard.user"), render: (c) => <CommentAuthor userId={c.userId} /> },
    {
      key: "likes",
      label: t("dashboard.likes"),
      render: (c) => (
        <span className="inline-flex items-center gap-1 font-mono text-xs text-gray-500">
          <HiOutlineHandThumbUp className="h-3.5 w-3.5" />
          {c.numberOfLikes}
        </span>
      ),
    },
    { key: "createdAt", label: t("dashboard.added"), className: "whitespace-nowrap text-xs text-gray-500", render: (c) => timeAgo(c.createdAt) },
    {
      key: "actions",
      label: <span className="sr-only">{t("dashboard.actions")}</span>,
      className: "text-right",
      render: (c) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setToDelete(c._id)}
          aria-label={t("common.delete")}
          title={t("common.delete")}
          className="hover:text-red-600"
        >
          <HiOutlineTrash className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <>
      <p className="mb-4 text-sm text-gray-500">{t("dashboard.commentsCount", { count: list.total })}</p>
      <DataTable
        columns={columns}
        rows={list.items}
        loading={list.loading}
        hasMore={list.hasMore}
        onLoadMore={list.loadMore}
        loadingMore={list.loadingMore}
        empty={t("dashboard.noComments")}
      />
      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title={t("comments.deleteTitle")}
        description={t("comments.deleteDescription")}
      />
    </>
  );
}
