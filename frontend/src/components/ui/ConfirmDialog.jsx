import { useTranslation } from "react-i18next";
import { HiOutlineExclamationTriangle } from "react-icons/hi2";
import Modal from "./Modal";
import Button from "./Button";

export default function ConfirmDialog({ open, onClose, onConfirm, title, description, confirmLabel, loading }) {
  const { t } = useTranslation();

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="flex gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-500/10">
          <HiOutlineExclamationTriangle className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-semibold">{title}</h2>
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>
          {t("common.cancel")}
        </Button>
        <Button variant="danger" onClick={onConfirm} loading={loading}>
          {confirmLabel || t("common.delete")}
        </Button>
      </div>
    </Modal>
  );
}
