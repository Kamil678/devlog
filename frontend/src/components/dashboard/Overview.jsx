import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HiArrowRight, HiOutlineChatBubbleLeftRight, HiOutlineDocumentText, HiOutlineUsers } from "react-icons/hi2";
import ActivityChart from "./ActivityChart";
import Avatar from "../ui/Avatar";
import Skeleton from "../ui/Skeleton";
import { useApi } from "../../hooks/useApi";
import { formatDate, timeAgo } from "../../lib/format";

function StatTile({ icon: Icon, label, value, delta }) {
  const { t } = useTranslation();
  return (
    <div className="rounded-2xl border border-gray-200 p-5 dark:border-gray-800">
      <div className="flex items-center justify-between text-sm text-gray-500">
        {label}
        <Icon className="h-4 w-4" />
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-gray-500">
        <span className="font-medium text-emerald-600 dark:text-emerald-400">+{delta}</span> {t("dashboard.lastMonth")}
      </p>
    </div>
  );
}

function RecentList({ title, to, items, render, className = "" }) {
  const { t } = useTranslation();
  return (
    <div className={`rounded-2xl border border-gray-200 dark:border-gray-800 ${className}`}>
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3 dark:border-gray-800">
        <h3 className="text-sm font-semibold">{title}</h3>
        <Link to={to} className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white">
          {t("home.seeAll")}
          <HiArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <ul className="divide-y divide-gray-200 dark:divide-gray-800">
        {items ? (
          items.map((item) => (
            <li key={item._id} className="flex items-center gap-3 px-5 py-3 text-sm">
              {render(item)}
            </li>
          ))
        ) : (
          <li className="space-y-2 p-5">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </li>
        )}
      </ul>
    </div>
  );
}

export default function Overview() {
  const { t } = useTranslation();
  const { data: stats } = useApi("/stats");
  const { data: users } = useApi("/user/getusers?limit=5");
  const { data: posts } = useApi("/post/getposts?limit=5");
  const { data: comments } = useApi("/comment/getComments?limit=5");

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {stats ? (
          <>
            <StatTile icon={HiOutlineDocumentText} label={t("dashboard.posts")} value={stats.totals.posts} delta={stats.lastMonth.posts} />
            <StatTile
              icon={HiOutlineChatBubbleLeftRight}
              label={t("dashboard.comments")}
              value={stats.totals.comments}
              delta={stats.lastMonth.comments}
            />
            <StatTile icon={HiOutlineUsers} label={t("dashboard.users")} value={stats.totals.users} delta={stats.lastMonth.users} />
          </>
        ) : (
          [0, 1, 2].map((i) => <Skeleton key={i} className="h-32 rounded-2xl" />)
        )}
      </div>

      {stats && <ActivityChart months={stats.months} />}

      <div className="grid gap-6 md:grid-cols-2">
        <RecentList
          title={t("dashboard.recentPosts")}
          to="/dashboard?tab=posts"
          className="md:col-span-2"
          items={posts?.posts}
          render={(post) => (
            <>
              <img src={post.image} alt="" className="h-9 w-12 shrink-0 rounded-md object-cover" />
              <Link to={`/post/${post.slug}`} className="line-clamp-1 flex-1 hover:underline">
                {post.title}
              </Link>
              <span className="shrink-0 font-mono text-xs text-gray-400">{formatDate(post.createdAt, { day: "numeric", month: "short" })}</span>
            </>
          )}
        />
        <RecentList
          title={t("dashboard.recentComments")}
          to="/dashboard?tab=comments"
          items={comments?.comments}
          render={(comment) => (
            <>
              <p className="line-clamp-1 flex-1 text-gray-600 dark:text-gray-300">{comment.content}</p>
              <span className="shrink-0 text-xs text-gray-400">{timeAgo(comment.createdAt)}</span>
            </>
          )}
        />
        <RecentList
          title={t("dashboard.recentUsers")}
          to="/dashboard?tab=users"
          items={users?.users}
          render={(user) => (
            <>
              <Avatar src={user.picture} name={user.username} size="sm" />
              <span className="flex-1 truncate">{user.username}</span>
              <span className="shrink-0 text-xs text-gray-400">{timeAgo(user.createdAt)}</span>
            </>
          )}
        />
      </div>
    </div>
  );
}
