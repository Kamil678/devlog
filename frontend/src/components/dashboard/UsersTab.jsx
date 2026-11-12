import { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { HiOutlineTrash } from "react-icons/hi2";
import DataTable from "./DataTable";
import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import ConfirmDialog from "../ui/ConfirmDialog";
import { api } from "../../lib/api";
import { formatDate } from "../../lib/format";
import { usePaginated } from "../../hooks/usePaginated";
import { useErrorMessage } from "../../hooks/useErrorMessage";

export default function UsersTab() {
  const { t } = useTranslation();
  const errorMessage = useErrorMessage();
  const { user: currentUser } = useSelector((state) => state.user);
  const list = usePaginated("/user/getusers", "users", "totalUsers");
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api(`/user/delete/${toDelete}`, { method: "DELETE" });
      list.remove(toDelete);
      toast.success(t("dashboard.userDeleted"));
      setToDelete(null);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: "username",
      label: t("dashboard.user"),
      render: (user) => (
        <div className="flex min-w-[200px] items-center gap-3">
          <Avatar src={user.picture} name={user.username} size="md" />
          <div className="min-w-0">
            <p className="truncate font-medium">{user.username}</p>
            <p className="truncate text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: t("dashboard.role"),
      render: (user) =>
        user.isDemo ? <Badge tone="amber">demo</Badge> : user.isAdmin ? <Badge tone="brand">admin</Badge> : <Badge>{t("dashboard.reader")}</Badge>,
    },
    {
      key: "createdAt",
      label: t("dashboard.joined"),
      className: "whitespace-nowrap font-mono text-xs text-gray-500",
      render: (user) => formatDate(user.createdAt),
    },
    {
      key: "actions",
      label: <span className="sr-only">{t("dashboard.actions")}</span>,
      className: "text-right",
      render: (user) =>
        user._id !== currentUser._id && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setToDelete(user._id)}
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
      <p className="mb-4 text-sm text-gray-500">{t("dashboard.usersCount", { count: list.total })}</p>
      <DataTable
        columns={columns}
        rows={list.items}
        loading={list.loading}
        hasMore={list.hasMore}
        onLoadMore={list.loadMore}
        loadingMore={list.loadingMore}
        empty={t("dashboard.noUsers")}
      />
      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title={t("dashboard.deleteUserTitle")}
        description={t("dashboard.deleteUserDescription")}
      />
    </>
  );
}
