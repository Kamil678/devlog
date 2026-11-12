import { Link, Navigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  HiOutlineChatBubbleLeftRight,
  HiOutlineDocumentText,
  HiOutlineSquares2X2,
  HiOutlineUser,
  HiOutlineUsers,
} from "react-icons/hi2";
import Overview from "../components/dashboard/Overview";
import ProfileTab from "../components/dashboard/ProfileTab";
import PostsTab from "../components/dashboard/PostsTab";
import UsersTab from "../components/dashboard/UsersTab";
import CommentsTab from "../components/dashboard/CommentsTab";
import DemoNotice from "../components/dashboard/DemoNotice";
import Seo from "../components/ui/Seo";
import { cn } from "../lib/cn";

const tabs = [
  { id: "overview", icon: HiOutlineSquares2X2, component: Overview, admin: true },
  { id: "posts", icon: HiOutlineDocumentText, component: PostsTab, admin: true },
  { id: "comments", icon: HiOutlineChatBubbleLeftRight, component: CommentsTab, admin: true },
  { id: "users", icon: HiOutlineUsers, component: UsersTab, admin: true },
  { id: "profile", icon: HiOutlineUser, component: ProfileTab, admin: false },
];

export default function Dashboard() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const { user } = useSelector((state) => state.user);
  const available = tabs.filter((tab) => !tab.admin || user.isAdmin);
  const requested = params.get("tab") === "dashboard" ? "overview" : params.get("tab");
  const active = available.find((tab) => tab.id === requested);

  if (!active) return <Navigate to={`/dashboard?tab=${available[0].id}`} replace />;

  const ActiveComponent = active.component;

  return (
    <div className="container-page grid gap-8 py-10 md:grid-cols-[200px_minmax(0,1fr)]">
      <Seo title={t(`dashboard.tabs.${active.id}`)} />
      <nav aria-label={t("nav.dashboard")} className="-mx-4 overflow-x-auto px-4 scrollbar-none md:mx-0 md:px-0">
        <ul className="flex gap-1 md:sticky md:top-24 md:flex-col">
          {available.map((tab) => (
            <li key={tab.id}>
              <Link
                to={`/dashboard?tab=${tab.id}`}
                aria-current={tab.id === active.id ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors",
                  tab.id === active.id
                    ? "bg-gray-100 font-medium text-gray-900 dark:bg-gray-800 dark:text-white"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-900 dark:hover:text-white"
                )}
              >
                <tab.icon className="h-4 w-4" />
                {t(`dashboard.tabs.${tab.id}`)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <section className="min-w-0">
        <h1 className="mb-6 text-2xl font-bold tracking-tight">{t(`dashboard.tabs.${active.id}`)}</h1>
        <DemoNotice />
        <ActiveComponent />
      </section>
    </div>
  );
}
