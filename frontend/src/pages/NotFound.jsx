import { useTranslation } from "react-i18next";
import Button from "../components/ui/Button";
import Seo from "../components/ui/Seo";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <Seo title="404" />
      <p className="font-mono text-sm text-brand-600 dark:text-brand-400">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{t("notFound.title")}</h1>
      <p className="mt-3 max-w-md text-gray-500">{t("notFound.description")}</p>
      <div className="mt-8 flex gap-3">
        <Button to="/">{t("notFound.home")}</Button>
        <Button to="/search" variant="secondary">
          {t("nav.articles")}
        </Button>
      </div>
    </div>
  );
}
