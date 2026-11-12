import { useTranslation } from "react-i18next";
import PostEditor from "../components/posts/PostEditor";
import Seo from "../components/ui/Seo";
import { api } from "../lib/api";

export default function CreatePost() {
  const { t } = useTranslation();

  return (
    <div className="container-page py-10">
      <Seo title={t("editor.createTitle")} />
      <p className="mb-6 font-mono text-xs uppercase tracking-widest text-brand-600 dark:text-brand-400">{t("editor.createTitle")}</p>
      <PostEditor submitLabel={t("editor.publish")} onSubmit={(body) => api("/post/create", { method: "POST", body })} />
    </div>
  );
}
