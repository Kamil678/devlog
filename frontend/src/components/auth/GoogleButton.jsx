import { useState } from "react";
import { useTranslation } from "react-i18next";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { app } from "../../firebase";
import { api } from "../../lib/api";
import { useErrorMessage } from "../../hooks/useErrorMessage";
import Button from "../ui/Button";

export default function GoogleButton({ onSuccess, label }) {
  const { t } = useTranslation();
  const errorMessage = useErrorMessage();
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      setLoading(true);
      const result = await signInWithPopup(getAuth(app), provider);
      const idToken = await result.user.getIdToken();
      const user = await api("/auth/google", { method: "POST", body: { idToken } });
      onSuccess(user);
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user" && err.code !== "auth/cancelled-popup-request") {
        toast.error(errorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="secondary" className="w-full" onClick={signIn} loading={loading}>
      {!loading && <FcGoogle className="h-4 w-4" />}
      {label || t("auth.google")}
    </Button>
  );
}
