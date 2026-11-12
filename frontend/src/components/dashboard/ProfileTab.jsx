import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { HiOutlineCamera } from "react-icons/hi2";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import ConfirmDialog from "../ui/ConfirmDialog";
import { Input } from "../ui/Field";
import { api } from "../../lib/api";
import { uploadImage, validateImage } from "../../lib/upload";
import { setUser, clearUser } from "../../app/user/userSlice";
import { useErrorMessage } from "../../hooks/useErrorMessage";
import { useSignOut } from "../../hooks/useSession";

export default function ProfileTab() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const errorMessage = useErrorMessage();
  const signOut = useSignOut();
  const { user } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [form, setForm] = useState({ username: user.username, email: user.email, password: "" });
  const [picture, setPicture] = useState(null);
  const [progress, setProgress] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const pickImage = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const invalid = validateImage(file);
    if (invalid) return toast.error(t(`errors.${invalid}`));

    try {
      setProgress(0);
      setPicture(await uploadImage(file, `avatars/${user._id}`, setProgress));
    } catch {
      toast.error(t("errors.UPLOAD_FAILED"));
    } finally {
      setProgress(null);
    }
  };

  const changes = {
    ...(form.username.trim() !== user.username && { username: form.username.trim() }),
    ...(form.email.trim().toLowerCase() !== user.email && { email: form.email.trim() }),
    ...(form.password && { password: form.password }),
    ...(picture && { picture }),
  };
  const dirty = Object.keys(changes).length > 0;

  const save = async (e) => {
    e.preventDefault();
    if (!dirty) return;
    setSaving(true);
    try {
      const updated = await api(`/user/update/${user._id}`, { method: "PUT", body: changes });
      dispatch(setUser(updated));
      setForm({ username: updated.username, email: updated.email, password: "" });
      setPicture(null);
      toast.success(t("profile.saved"));
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const deleteAccount = async () => {
    setDeleting(true);
    try {
      await api(`/user/delete/${user._id}`, { method: "DELETE" });
      dispatch(clearUser());
    } catch (err) {
      toast.error(errorMessage(err));
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <form onSubmit={save} className="rounded-2xl border border-gray-200 dark:border-gray-800">
        <div className="space-y-6 p-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <Avatar src={picture || user.picture} name={user.username} size="xl" className={progress !== null ? "opacity-50" : ""} />
              {progress !== null && (
                <span className="absolute inset-0 flex items-center justify-center font-mono text-sm font-semibold">{progress}%</span>
              )}
            </div>
            <div>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={pickImage} />
              <Button variant="secondary" size="sm" onClick={() => fileRef.current.click()} disabled={progress !== null || user.isDemo}>
                <HiOutlineCamera className="h-4 w-4" />
                {t("profile.changePhoto")}
              </Button>
              <p className="mt-2 text-xs text-gray-500">{t("profile.photoHint")}</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label={t("auth.username")} name="username" value={form.username} onChange={change} disabled={user.isDemo} />
            <Input label={t("auth.email")} type="email" name="email" value={form.email} onChange={change} disabled={user.isDemo} />
          </div>
          <Input
            label={t("profile.newPassword")}
            type="password"
            name="password"
            autoComplete="new-password"
            value={form.password}
            onChange={change}
            hint={t("profile.passwordHint")}
            disabled={user.isDemo}
          />
        </div>
        <div className="flex justify-end gap-2 border-t border-gray-200 bg-gray-50 px-6 py-3 dark:border-gray-800 dark:bg-gray-900/50">
          <Button type="submit" size="sm" loading={saving} disabled={!dirty || progress !== null}>
            {t("common.saveChanges")}
          </Button>
        </div>
      </form>

      <div className="flex flex-col gap-4 rounded-2xl border border-red-200 p-6 sm:flex-row sm:items-center sm:justify-between dark:border-red-500/20">
        <div>
          <h3 className="font-semibold">{t("profile.dangerTitle")}</h3>
          <p className="mt-1 text-sm text-gray-500">{t("profile.dangerDescription")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={signOut}>
            {t("nav.signOut")}
          </Button>
          <Button variant="danger" size="sm" onClick={() => setConfirmOpen(true)} disabled={user.isDemo}>
            {t("profile.deleteAccount")}
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={deleteAccount}
        loading={deleting}
        title={t("profile.deleteTitle")}
        description={t("profile.deleteDescription")}
        confirmLabel={t("profile.deleteAccount")}
      />
    </div>
  );
}
