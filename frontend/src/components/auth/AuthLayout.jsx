import { useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Logo from "../ui/Logo";
import Seo from "../ui/Seo";
import DemoLink from "./DemoLink";
import { cn } from "../../lib/cn";
import Signin from "../../pages/Signin";
import Signup from "../../pages/Signup";

const tabs = [
  { to: "/sign-in", label: "auth.tabSignIn", title: "auth.signInTitle", description: "auth.signInDescription", Form: Signin },
  { to: "/sign-up", label: "auth.tabSignUp", title: "auth.signUpTitle", description: "auth.signUpDescription", Form: Signup },
];

export default function AuthLayout() {
  const { t } = useTranslation();
  const { pathname, state } = useLocation();
  const active = tabs.find((tab) => tab.to === pathname) ?? tabs[0];
  const activeIndex = tabs.indexOf(active);
  const contentRef = useRef(null);
  const [height, setHeight] = useState();

  useLayoutEffect(() => {
    const observer = new ResizeObserver(([entry]) => setHeight(entry.target.offsetHeight));
    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative isolate flex min-h-[calc(100vh-4rem)] items-start justify-center overflow-hidden px-4 pb-16 pt-10 sm:pt-16">
      <Seo title={t(active.title)} />
      <div className="bg-dots absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_60%_55%_at_50%_50%,black,transparent_75%)]" />

      <div className="relative w-full max-w-[400px] animate-fade-up">
        <div className="absolute left-1/2 top-0 -z-10 h-72 w-[34rem] max-w-[100vw] -translate-x-1/2 -translate-y-1/4 rounded-full bg-brand-400/25 blur-3xl dark:bg-brand-500/15" />
        <div className="mb-6 flex justify-center">
          <Logo className="text-lg" />
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white/85 p-6 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_24px_60px_-24px_rgb(14_116_144/0.25)] backdrop-blur-md sm:p-8 dark:border-gray-800 dark:bg-gray-900/70 dark:shadow-[0_30px_60px_-25px_black,inset_0_1px_0_rgb(255_255_255/0.05)]">
          <nav
            className="relative mb-7 grid grid-cols-2 rounded-xl bg-gray-100 p-1 dark:border dark:border-gray-800 dark:bg-gray-950"
            aria-label={t("auth.tabsLabel")}
          >
            <span
              aria-hidden
              className="absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-lg bg-white shadow-sm transition-transform duration-300 ease-out dark:bg-gray-800"
              style={{ transform: `translateX(${activeIndex * 100}%)` }}
            />
            {tabs.map((tab, index) => (
              <Link
                key={tab.to}
                to={tab.to}
                state={state}
                replace
                aria-current={index === activeIndex ? "page" : undefined}
                className={cn(
                  "relative z-10 rounded-lg py-2 text-center text-sm font-medium transition-colors",
                  index === activeIndex
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
                )}
              >
                {t(tab.label)}
              </Link>
            ))}
          </nav>

          <div className="-m-1 overflow-hidden transition-[height] duration-300 ease-out" style={{ height }}>
            <div ref={contentRef} className="relative p-1">
              {tabs.map(({ to, title, description, Form }) => {
                const isActive = to === active.to;
                return (
                  <section
                    key={to}
                    aria-hidden={!isActive}
                    inert={isActive ? undefined : ""}
                    className={cn(
                      "transition-[opacity,transform] duration-300 ease-out",
                      isActive ? "opacity-100" : "pointer-events-none absolute inset-x-1 top-1 translate-y-1 opacity-0",
                    )}
                  >
                    <h1 className="text-2xl font-bold tracking-tight">{t(title)}</h1>
                    <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">{t(description)}</p>
                    <div className="mt-6">
                      <Form />
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </div>

        <DemoLink />
      </div>
    </div>
  );
}
