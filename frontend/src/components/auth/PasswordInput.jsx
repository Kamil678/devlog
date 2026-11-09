import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "../ui/Field";

export default function PasswordInput(props) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  return (
    <Input
      {...props}
      type={visible ? "text" : "password"}
      inputClassName="pr-16"
      trailing={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-pressed={visible}
          className="rounded px-1.5 py-0.5 text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
        >
          {visible ? t("auth.hidePassword") : t("auth.showPassword")}
        </button>
      }
    />
  );
}
