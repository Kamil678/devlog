import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { HiOutlinePencilSquare, HiOutlinePlus, HiOutlineTrash } from "react-icons/hi2";
import DataTable from "./DataTable";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import ConfirmDialog from "../ui/ConfirmDialog";
import { api } from "../../lib/api";
import { formatDate } from "../../lib/format";
import { usePaginated } from "../../hooks/usePaginated";
import { useErrorMessage } from "../../hooks/useErrorMessage";

export default function PostsTab() {
  const { t } = useTranslation();
  const errorMessage = useErrorMessage();
  const { user } = useSelector((state) => state.user);
  const list = usePaginated("/post/getposts", "posts", "totalPosts");
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api(`/post/delete/${toDelete}`, { method: "DELETE" });
      list.remove(toDelete);
      toast.success(t("dashboard.postDeleted"));
      setToDelete(null);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: "title",
      label: t("dashboard.title"),
      render: (post) => (
        <div className="flex min-w-[240px] items-center gap-3">
          <img src={post.image} alt="" className="h-10 w-14 shrink-0 rounded-md object-cover" />
          <Link to={`/post/${post.slug}`} className="line-clamp-2 font-medium hover:underline">
            {post.title}
          </Link>
        </div>
      ),
    },
    { key: "category", label: t("dashboard.category"), render: (post) => <Badge>{post.category}</Badge> },
    {
      key: "updatedAt",
      label: t("dashboard.updated"),
      className: "whitespace-nowrap font-mono text-xs text-gray-500",
      render: (post) => formatDate(post.updatedAt),
    },
    {
      key: "actions",
      label: <span className="sr-only">{t("dashboard.actions")}</span>,
      className: "text-right",
      render: (post) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" to={`/edit-post/${post._id}`} aria-label={t("common.edit")} title={t("common.edit")}>
            <HiOutlinePencilSquare className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setToDelete(post._id)}
            aria-label={t("common.delete")}
            title={t("common.delete")}
            className="hover:text-red-600"
          >
            <HiOutlineTrash className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">{t("dashboard.postsCount", { count: list.total })}</p>
        {!user.isDemo && (
          <Button to="/create-post" size="sm">
            <HiOutlinePlus className="h-4 w-4" />
            {t("nav.newPost")}
          </Button>
        )}
      </div>
      <DataTable
        columns={columns}
        rows={list.items}
        loading={list.loading}
        hasMore={list.hasMore}
        onLoadMore={list.loadMore}
        loadingMore={list.loadingMore}
        empty={t("dashboard.noPosts")}
      />
      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title={t("dashboard.deletePostTitle")}
        description={t("dashboard.deletePostDescription")}
      />
    </>
  );
}
