import { useTranslation } from "react-i18next";

export function useErrorMessage() {
  const { t } = useTranslation();

  return (error) => {
    const code = error?.details?.[0]?.code || error?.code;
    return t(`errors.${code}`, { defaultValue: t("errors.GENERIC") });
  };
}
