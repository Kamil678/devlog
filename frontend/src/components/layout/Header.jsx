import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { HiBars3, HiMagnifyingGlass, HiXMark } from "react-icons/hi2";
import Logo from "../ui/Logo";
import Button from "../ui/Button";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitch from "./LanguageSwitch";
import UserMenu from "./UserMenu";
import SearchDialog from "./SearchDialog";
import { cn } from "../../lib/cn";

export default function Header() {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const links = [
    { to: "/", label: t("nav.home"), end: true },
    { to: "/search", label: t("nav.articles") },
    { to: "/stack", label: t("nav.howItWorks") },
  ];

  const linkClass = ({ isActive }) =>
    cn(
      "rounded-lg px-3 py-2 text-sm transition-colors",
      isActive
        ? "font-medium text-gray-900 dark:text-white"
        : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
    );

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/70 bg-white/75 backdrop-blur-xl dark:border-gray-800/70 dark:bg-gray-950/75">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 dark:focus:bg-gray-900">
        {t("nav.skipToContent")}
      </a>
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center md:flex" aria-label={t("nav.main")}>
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="hidden h-9 items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 pl-3 pr-1.5 text-sm text-gray-500 transition-colors hover:border-gray-300 lg:flex dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
          >
            <HiMagnifyingGlass className="h-4 w-4" />
            <span className="w-32 truncate whitespace-nowrap text-left">{t("search.short")}</span>
            <kbd className="rounded border border-gray-200 bg-white px-1.5 font-mono text-[11px] dark:border-gray-700 dark:bg-gray-800">
              {isMac ? "⌘" : "Ctrl"} K
            </kbd>
          </button>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSearchOpen(true)} aria-label={t("search.title")}>
            <HiMagnifyingGlass className="h-[18px] w-[18px]" />
          </Button>
          <LanguageSwitch className="hidden sm:flex" />
          <ThemeToggle />
          {user ? (
            <div className="ml-1">
              <UserMenu user={user} />
            </div>
          ) : (
            <Button to="/sign-in" size="sm" className="ml-1 hidden sm:inline-flex">
              {t("nav.signIn")}
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={t("nav.menu")}
          >
            {menuOpen ? <HiXMark className="h-5 w-5" /> : <HiBars3 className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-gray-200 animate-fade-in md:hidden dark:border-gray-800" aria-label={t("nav.main")}>
          <div className="container-page flex flex-col gap-1 py-3">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
                {link.label}
              </NavLink>
            ))}
            <div className="mt-2 flex items-center justify-between border-t border-gray-200 px-3 pt-3 dark:border-gray-800">
              <LanguageSwitch />
              {!user && (
                <Button to="/sign-in" size="sm">
                  {t("nav.signIn")}
                </Button>
              )}
            </div>
          </div>
        </nav>
      )}

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
