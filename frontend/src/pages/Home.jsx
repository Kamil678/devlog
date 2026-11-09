import { useTranslation } from "react-i18next";
import { HiArrowRight, HiArrowUpRight, HiOutlineDocumentText } from "react-icons/hi2";
import PostCard, { PostCardSkeleton } from "../components/posts/PostCard";
import AuthorCard from "../components/AuthorCard";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import Seo from "../components/ui/Seo";
import { useApi } from "../hooks/useApi";
import { site } from "../lib/site";

export default function Home() {
  const { t } = useTranslation();
  const { data, loading } = useApi("/post/getposts?limit=7");
  const { data: categoryData } = useApi("/post/categories");

  const posts = data?.posts ?? [];
  const [featured, ...latest] = posts;

  return (
    <>
      <Seo />
      <section className="relative overflow-hidden border-b border-gray-200 dark:border-gray-800">
        <div className="bg-dots absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
        <div className="absolute left-1/2 top-0 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-brand-400/20 blur-3xl dark:bg-brand-500/10" />
        <div className="container-page relative py-20 sm:py-28">
          <div className="max-w-3xl animate-fade-up">
            <p className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-3 py-1 font-mono text-xs text-gray-600 backdrop-blur dark:border-gray-800 dark:bg-gray-900/70 dark:text-gray-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {t("home.eyebrow")}
            </p>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-balance sm:text-6xl">
              {t("home.titleStart")} <span className="text-brand-600 dark:text-brand-400">{t("home.titleAccent")}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-gray-600 text-pretty dark:text-gray-400">{t("home.subtitle")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/search" size="lg">
                {t("home.browse")}
                <HiArrowRight className="h-4 w-4" />
              </Button>
              <Button href={site.portfolio} size="lg" variant="secondary">
                {t("home.portfolio")}
                <HiArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-brand-600 dark:text-brand-400">{t("home.latestEyebrow")}</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{t("home.latestTitle")}</h2>
          </div>
          <Button to="/search" variant="ghost" size="sm" className="self-start sm:self-auto">
            {t("home.seeAll")}
            <HiArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {categoryData?.categories?.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {categoryData.categories.map((category) => (
              <Badge key={category} to={`/search?category=${encodeURIComponent(category)}`} className="px-3 py-1">
                #{category}
              </Badge>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <EmptyState icon={HiOutlineDocumentText} title={t("home.emptyTitle")} description={t("home.emptyDescription")} />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="sm:col-span-2 lg:col-span-3">
              <PostCard post={featured} featured />
            </div>
            {latest.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </section>

      <section className="container-page pb-20">
        <AuthorCard />
      </section>
    </>
  );
}
