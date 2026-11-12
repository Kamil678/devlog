import { useTranslation } from "react-i18next";
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi2";
import { useTheme } from "../../lib/theme";
import Button from "../ui/Button";

export default function ThemeToggle() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={t("nav.toggleTheme")} title={t("nav.toggleTheme")}>
      {theme === "dark" ? <HiOutlineSun className="h-[18px] w-[18px]" /> : <HiOutlineMoon className="h-[18px] w-[18px]" />}
    </Button>
  );
}
