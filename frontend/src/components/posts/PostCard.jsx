import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Badge from "../ui/Badge";
import Skeleton from "../ui/Skeleton";
import { excerpt, formatDate, readingTime } from "../../lib/format";
import { cn } from "../../lib/cn";

export function PostMeta({ post, className }) {
  const { t } = useTranslation();
  return (
    <div className={cn("flex items-center gap-2 font-mono text-xs text-gray-500", className)}>
      <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
      <span aria-hidden="true">·</span>
      <span>{t("post.readingTime", { count: readingTime(post.content) })}</span>
    </div>
  );
}

export default function PostCard({ post, featured = false }) {
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-xl hover:shadow-gray-200/60 dark:border-gray-800 dark:bg-gray-900/40 dark:hover:border-gray-700 dark:hover:shadow-none",
        featured && "md:flex-row"
      )}
    >
      <div className={cn("relative overflow-hidden bg-gray-100 dark:bg-gray-900", featured ? "aspect-[16/9] md:aspect-auto md:w-3/5" : "aspect-[16/9]")}>
        <img
          src={post.image}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className={cn("flex flex-1 flex-col gap-3 p-5", featured && "md:justify-center md:p-8")}>
        <div className="flex items-center justify-between gap-2">
          {post.category && post.category !== "uncategorized" ? <Badge tone="brand">{post.category}</Badge> : <span />}
        </div>
        <h3 className={cn("font-semibold leading-snug tracking-tight", featured ? "text-2xl md:text-3xl" : "text-lg")}>
          <Link to={`/post/${post.slug}`} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h3>
        <p className={cn("text-sm text-gray-500 dark:text-gray-400", featured ? "line-clamp-3 md:text-base" : "line-clamp-2")}>
          {excerpt(post.content, featured ? 220 : 140)}
        </p>
        <PostMeta post={post} className="mt-auto pt-2" />
      </div>
    </article>
  );
}

export function PostCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
      <Skeleton className="aspect-[16/9] rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}
