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

const validators = {
  username: (v) =>
    v.length < 3 ? "USERNAME_TOO_SHORT" : v.length > 30 ? "USERNAME_TOO_LONG" : !/^[a-zA-Z0-9._-]+$/.test(v) ? "USERNAME_INVALID_CHARS" : null,
  email: (v) => (!/^\S+@\S+\.\S+$/.test(v) ? "EMAIL_INVALID" : null),
  password: (v) => (v.length < 8 ? "PASSWORD_TOO_SHORT" : null),
};

export default function Signup() {
  const { t } = useTranslation();
  const errorMessage = useErrorMessage();
  const onSignedIn = useAuthRedirect();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [touched, setTouched] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fieldErrors = Object.fromEntries(Object.entries(validators).map(([key, check]) => [key, check(form[key].trim())]));
  const isValid = Object.values(fieldErrors).every((e) => !e);
  const fieldError = (name) => touched[name] && fieldErrors[name] && t(`errors.${fieldErrors[name]}`);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const blur = (e) => setTouched({ ...touched, [e.target.name]: true });

  const submit = async (e) => {
    e.preventDefault();
    setTouched({ username: true, email: true, password: true });
    if (!isValid) return;

    setError(null);
    setLoading(true);
    try {
      const user = await api("/auth/signup", {
        method: "POST",
        body: { username: form.username.trim(), email: form.email.trim(), password: form.password },
      });
      onSignedIn(user);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <GoogleButton onSuccess={onSignedIn} label={t("auth.googleSignUp")} />
      <Divider label={t("auth.or")} />
      <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
        <Input
          label={t("auth.username")}
          name="username"
          autoComplete="username"
          value={form.username}
          onChange={change}
          onBlur={blur}
          error={fieldError("username")}
        />
        <Input
          label={t("auth.email")}
          type="email"
          name="email"
          autoComplete="email"
          value={form.email}
          onChange={change}
          onBlur={blur}
          error={fieldError("email")}
        />
        <PasswordInput
          label={t("auth.password")}
          name="password"
          autoComplete="new-password"
          value={form.password}
          onChange={change}
          onBlur={blur}
          error={fieldError("password")}
          hint={t("auth.passwordHint")}
        />
        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
            {error}
          </p>
        )}
        <Button type="submit" variant="accent" className="mt-1 w-full font-semibold" loading={loading}>
          {t("auth.createAccount")}
        </Button>
      </form>
    </>
  );
}
