import { useMemo, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { HiArrowLeft, HiOutlineLink, HiOutlinePencilSquare } from "react-icons/hi2";
import PostCard, { PostMeta } from "../components/posts/PostCard";
import ReadingProgress from "../components/posts/ReadingProgress";
import TableOfContents from "../components/posts/TableOfContents";
import CommentSection from "../components/comments/CommentSection";
import AuthorCard from "../components/AuthorCard";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Skeleton from "../components/ui/Skeleton";
import Seo from "../components/ui/Seo";
import NotFound from "./NotFound";
import { useApi } from "../hooks/useApi";
import { toQuery } from "../lib/api";
import { excerpt } from "../lib/format";
import { prepareContent } from "../lib/content";

function PostSkeleton() {
  return (
    <div className="container-page max-w-3xl py-12">
      <Skeleton className="h-5 w-20 rounded-full" />
      <Skeleton className="mt-6 h-10 w-full" />
      <Skeleton className="mt-3 h-10 w-2/3" />
      <Skeleton className="mt-10 aspect-[16/9] w-full rounded-2xl" />
      <div className="mt-10 space-y-3">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </div>
  );
}

export default function Post() {
  const { t } = useTranslation();
  const { postSlug } = useParams();
  const { user } = useSelector((state) => state.user);
  const articleRef = useRef(null);

  const { data, loading, error } = useApi(`/post/getposts${toQuery({ slug: postSlug })}`);
  const post = data?.posts?.[0];
  const { data: author } = useApi(post ? `/user/${post.author}` : null);
  const { data: relatedData } = useApi(
    post ? `/post/getposts${toQuery({ category: post.category !== "uncategorized" ? post.category : undefined, limit: 4 })}` : null
  );

  const content = useMemo(() => (post ? prepareContent(post.content) : null), [post]);
  const related = (relatedData?.posts ?? []).filter((p) => p._id !== post?._id).slice(0, 3);

  if (loading) return <PostSkeleton />;
  if (error || !post) return <NotFound />;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success(t("post.linkCopied"));
    } catch {
      toast.error(t("errors.GENERIC"));
    }
  };

  return (
    <>
      <Seo title={post.title} description={excerpt(post.content)} image={post.image} type="article" />
      <ReadingProgress targetRef={articleRef} />

      <article ref={articleRef}>
        <header className="container-page max-w-3xl pb-10 pt-12 text-center">
          <Link to="/search" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white">
            <HiArrowLeft className="h-4 w-4" />
            {t("post.back")}
          </Link>
          <div className="mt-8 flex justify-center">
            {post.category !== "uncategorized" && (
              <Badge tone="brand" to={`/search?category=${encodeURIComponent(post.category)}`}>
                {post.category}
              </Badge>
            )}
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-5xl">{post.title}</h1>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {author && (
              <span className="flex items-center gap-2 text-sm font-medium">
                <Avatar src={author.picture} name={author.username} size="sm" />
                {author.username}
              </span>
            )}
            <PostMeta post={post} />
          </div>
        </header>

        <div className="container-page max-w-5xl">
          <img src={post.image} alt="" className="aspect-[2/1] w-full rounded-2xl border border-gray-200 object-cover dark:border-gray-800" />
        </div>

        <div className="container-page mt-12 grid max-w-5xl gap-12 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div className="min-w-0">
            <div
              className="prose prose-gray max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-headings:tracking-tight prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline prose-code:rounded-md prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-medium prose-code:before:content-none prose-code:after:content-none dark:prose-code:bg-gray-800 prose-pre:rounded-xl prose-pre:border prose-pre:border-gray-800 prose-pre:bg-gray-950 prose-img:rounded-xl dark:prose-a:text-brand-400 sm:prose-lg"
              dangerouslySetInnerHTML={{ __html: content.html }}
            />
            <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-6 dark:border-gray-800">
              <Button variant="secondary" size="sm" onClick={copyLink}>
                <HiOutlineLink className="h-4 w-4" />
                {t("post.copyLink")}
              </Button>
              {user?.isAdmin && !user.isDemo && (
                <Button variant="ghost" size="sm" to={`/edit-post/${post._id}`}>
                  <HiOutlinePencilSquare className="h-4 w-4" />
                  {t("common.edit")}
                </Button>
              )}
            </div>
            <div className="mt-10">
              <AuthorCard />
            </div>
            <CommentSection postId={post._id} />
          </div>
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <TableOfContents headings={content.headings} />
            </div>
          </aside>
        </div>
      </article>

      {related.length > 0 && (
        <section className="mt-20 border-t border-gray-200 bg-gray-50/60 py-16 dark:border-gray-800 dark:bg-gray-900/30">
          <div className="container-page">
            <h2 className="text-2xl font-bold tracking-tight">{t("post.related")}</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <PostCard key={p._id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
