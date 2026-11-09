import { useTranslation } from "react-i18next";
import { BsGithub } from "react-icons/bs";
import Button from "./ui/Button";
import photo from "../assets/kp.jpg";
import { site } from "../lib/site";

export default function AuthorCard() {
  const { t } = useTranslation();

  return (
    <aside className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-gray-50 p-6 sm:flex-row sm:items-center dark:border-gray-800 dark:bg-gray-900/50">
      <img src={photo} alt={site.author} className="h-16 w-16 rounded-full object-cover ring-4 ring-white dark:ring-gray-950" />
      <div className="flex-1">
        <p className="font-mono text-xs uppercase tracking-widest text-gray-400">{t("author.writtenBy")}</p>
        <p className="mt-1 font-semibold">{site.author}</p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t("author.bio")}</p>
      </div>
      <div className="flex gap-2">
        <Button href={site.portfolio} variant="secondary" size="sm">
          {t("home.portfolio")}
        </Button>
        <Button href={site.github} variant="ghost" size="icon" aria-label="GitHub">
          <BsGithub className="h-4 w-4" />
        </Button>
      </div>
    </aside>
  );
}
