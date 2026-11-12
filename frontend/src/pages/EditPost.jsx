import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PostEditor from "../components/posts/PostEditor";
import Seo from "../components/ui/Seo";
import Spinner from "../components/ui/Spinner";
import NotFound from "./NotFound";
import { api, toQuery } from "../lib/api";
import { useApi } from "../hooks/useApi";

export default function EditPost() {
  const { t } = useTranslation();
  const { postId } = useParams();
  const { data, loading } = useApi(`/post/getposts${toQuery({ postId })}`);
  const post = data?.posts?.[0];

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-gray-400">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }
  if (!post) return <NotFound />;

  return (
    <div className="container-page py-10">
      <Seo title={t("editor.editTitle")} />
      <p className="mb-6 font-mono text-xs uppercase tracking-widest text-brand-600 dark:text-brand-400">{t("editor.editTitle")}</p>
      <PostEditor
        initial={post}
        submitLabel={t("common.saveChanges")}
        onSubmit={(body) => api(`/post/edit/${post._id}`, { method: "PUT", body })}
      />
    </div>
  );
}
