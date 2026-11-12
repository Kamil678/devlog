import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { HiOutlineEye } from "react-icons/hi2";

export default function DemoNotice() {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.user);
  if (!user?.isDemo) return null;

  return (
    <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/5 dark:text-amber-200">
      <HiOutlineEye className="mt-0.5 h-4 w-4 shrink-0" />
      <p>{t("demo.dashboardNote")}</p>
    </div>
  );
}
