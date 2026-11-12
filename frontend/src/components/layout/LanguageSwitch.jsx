import { useTranslation } from "react-i18next";
import { cn } from "../../lib/cn";

export default function LanguageSwitch({ className }) {
  const { i18n, t } = useTranslation();
  const current = i18n.resolvedLanguage;

  return (
    <div
      role="group"
      aria-label={t("nav.language")}
      className={cn("flex items-center rounded-lg border border-gray-200 p-0.5 font-mono text-xs dark:border-gray-800", className)}
    >
      {["pl", "en"].map((lng) => (
        <button
          key={lng}
          type="button"
          onClick={() => i18n.changeLanguage(lng)}
          aria-pressed={current === lng}
          className={cn(
            "rounded-md px-2 py-1 uppercase transition-colors",
            current === lng
              ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
              : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
          )}
        >
          {lng}
        </button>
      ))}
    </div>
  );
}
