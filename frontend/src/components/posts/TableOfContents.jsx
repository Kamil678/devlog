import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../../lib/cn";

export default function TableOfContents({ headings }) {
  const { t } = useTranslation();
  const [active, setActive] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px" }
    );
    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav aria-label={t("post.toc")}>
      <p className="font-mono text-xs uppercase tracking-widest text-gray-400">{t("post.toc")}</p>
      <ul className="mt-4 space-y-2 border-l border-gray-200 dark:border-gray-800">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={cn(
                "-ml-px block border-l py-0.5 text-sm transition-colors",
                heading.level === 3 ? "pl-7" : "pl-4",
                active === heading.id
                  ? "border-brand-500 text-gray-900 dark:text-white"
                  : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
