import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BsGithub, BsLinkedin } from "react-icons/bs";
import Logo from "../ui/Logo";
import { site } from "../../lib/site";

export default function Footer() {
  const { t } = useTranslation();

  const columns = [
    {
      title: t("footer.blog"),
      links: [
        { to: "/search", label: t("nav.articles") },
        { to: "/stack", label: t("nav.howItWorks") },
      ],
    },
    {
      title: t("footer.elsewhere"),
      links: [
        { href: site.github, label: "GitHub" },
        { href: site.linkedin, label: "LinkedIn" },
        ...(site.portfolio ? [{ href: site.portfolio, label: t("home.portfolio") }] : []),
        { href: site.repo, label: t("footer.sourceCode") },
      ],
    },
  ];

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-[2fr_1fr_1fr]">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-3 text-sm text-gray-500">{t("footer.description")}</p>
          <div className="mt-4 flex gap-2">
            {[
              { href: site.github, icon: BsGithub, label: "GitHub" },
              { href: site.linkedin, icon: BsLinkedin, label: "LinkedIn" },
            ].map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:text-gray-900 dark:border-gray-800 dark:hover:text-white"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        {columns.map((column) => (
          <div key={column.title}>
            <h3 className="font-mono text-xs uppercase tracking-widest text-gray-400">{column.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link.label}>
                  {link.to ? (
                    <Link to={link.to} className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-200 dark:border-gray-800">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-gray-500 sm:flex-row sm:justify-between">
          <span>
            © {new Date().getFullYear()} {site.author}
          </span>
          <span className="font-mono">React · Express · MongoDB</span>
        </div>
      </div>
    </footer>
  );
}
