import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HiOutlineArrowRightOnRectangle, HiOutlinePencilSquare, HiOutlineSquares2X2, HiOutlineUser } from "react-icons/hi2";
import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";
import { useSignOut } from "../../hooks/useSession";

export default function UserMenu({ user }) {
  const { t } = useTranslation();
  const signOut = useSignOut();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => !ref.current?.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const itemClass =
    "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={t("nav.account")}
        className="rounded-full"
      >
        <Avatar src={user.picture} name={user.username} size="md" />
      </button>

      {open && (
        <div
          role="menu"
          onClick={() => setOpen(false)}
          className="absolute right-0 mt-2 w-60 rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl animate-fade-up dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="border-b border-gray-100 px-3 pb-2.5 pt-1.5 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-semibold">{user.username}</p>
              {user.isDemo ? <Badge tone="amber">demo</Badge> : user.isAdmin && <Badge tone="brand">admin</Badge>}
            </div>
            <p className="truncate text-xs text-gray-500">{user.email}</p>
          </div>
          <div className="pt-1.5">
            <Link to="/dashboard?tab=profile" className={itemClass} role="menuitem">
              <HiOutlineUser className="h-4 w-4" />
              {t("nav.profile")}
            </Link>
            {user.isAdmin && (
              <>
                <Link to="/dashboard?tab=overview" className={itemClass} role="menuitem">
                  <HiOutlineSquares2X2 className="h-4 w-4" />
                  {t("nav.dashboard")}
                </Link>
                {!user.isDemo && (
                  <Link to="/create-post" className={itemClass} role="menuitem">
                    <HiOutlinePencilSquare className="h-4 w-4" />
                    {t("nav.newPost")}
                  </Link>
                )}
              </>
            )}
            <button type="button" onClick={signOut} className={`${itemClass} text-red-600 dark:text-red-400`} role="menuitem">
              <HiOutlineArrowRightOnRectangle className="h-4 w-4" />
              {t("nav.signOut")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
