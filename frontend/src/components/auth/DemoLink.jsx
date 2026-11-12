import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { HiArrowRight } from "react-icons/hi2";
import Spinner from "../ui/Spinner";
import { api } from "../../lib/api";
import { useErrorMessage } from "../../hooks/useErrorMessage";
import { useAuthRedirect } from "../../hooks/useAuthRedirect";

export default function DemoLink() {
  const { t } = useTranslation();
  const errorMessage = useErrorMessage();
  const onSignedIn = useAuthRedirect();
  const [loading, setLoading] = useState(false);

  const enter = async () => {
    setLoading(true);
    try {
      onSignedIn(await api("/auth/demo", { method: "POST" }));
    } catch (err) {
      toast.error(errorMessage(err));
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-sm text-gray-600 dark:text-gray-400">
      {t("auth.guestPrompt")}
      <button
        type="button"
        onClick={enter}
        disabled={loading}
        className="group inline-flex items-center gap-1 rounded font-medium text-brand-600 transition-colors hover:text-brand-700 disabled:opacity-60 dark:text-brand-400 dark:hover:text-brand-300"
      >
        {t("auth.guestLink")}
        {loading ? <Spinner className="h-3.5 w-3.5" /> : <HiArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />}
      </button>
      <span
        title={t("auth.guestHint")}
        className="rounded-full border border-brand-200 bg-brand-50 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-brand-700 dark:border-brand-800 dark:bg-brand-950 dark:text-brand-300"
      >
        DEMO
      </span>
    </div>
  );
}
