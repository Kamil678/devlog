import { useState } from "react";
import { useTranslation } from "react-i18next";
import Divider from "../components/auth/Divider";
import GoogleButton from "../components/auth/GoogleButton";
import PasswordInput from "../components/auth/PasswordInput";
import Button from "../components/ui/Button";
import { Input } from "../components/ui/Field";
import { api } from "../lib/api";
import { useErrorMessage } from "../hooks/useErrorMessage";
import { useAuthRedirect } from "../hooks/useAuthRedirect";

export default function Signin() {
  const { t } = useTranslation();
  const errorMessage = useErrorMessage();
  const onSignedIn = useAuthRedirect();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      onSignedIn(await api("/auth/signin", { method: "POST", body: { ...form, email: form.email.trim() } }));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <GoogleButton onSuccess={onSignedIn} />
      <Divider label={t("auth.or")} />
      <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
        <Input label={t("auth.email")} type="email" name="email" autoComplete="email" value={form.email} onChange={change} required />
        <PasswordInput label={t("auth.password")} name="password" autoComplete="current-password" value={form.password} onChange={change} required />
        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
            {error}
          </p>
        )}
        <Button type="submit" variant="accent" className="mt-1 w-full font-semibold" loading={loading} disabled={!form.email || !form.password}>
          {t("auth.signIn")}
        </Button>
      </form>
    </>
  );
}
