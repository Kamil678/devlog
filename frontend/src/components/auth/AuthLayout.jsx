import { useTranslation } from "react-i18next";
import { HiOutlineChatBubbleLeftRight, HiOutlineCodeBracket, HiOutlineShieldCheck } from "react-icons/hi2";

export default function AuthLayout({ title, description, children, footer }) {
  const { t } = useTranslation();

  const features = [
    { icon: HiOutlineCodeBracket, text: t("auth.feature1") },
    { icon: HiOutlineChatBubbleLeftRight, text: t("auth.feature2") },
    { icon: HiOutlineShieldCheck, text: t("auth.feature3") },
  ];

  return (
    <div className="container-page grid min-h-[calc(100vh-4rem)] items-center gap-12 py-12 lg:grid-cols-2">
      <div className="relative hidden h-full overflow-hidden rounded-3xl border border-gray-200 bg-gray-50 p-10 lg:flex lg:flex-col lg:justify-end dark:border-gray-800 dark:bg-gray-900">
        <div className="bg-dots absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="relative mb-auto overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl shadow-gray-200/50 dark:border-gray-800 dark:bg-gray-950 dark:shadow-none">
          <div className="flex items-center gap-1.5 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
            <span className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-700" />
            <span className="ml-2 font-mono text-xs text-gray-400">auth.js</span>
          </div>
          <pre className="overflow-hidden p-4 font-mono text-[12.5px] leading-6 text-gray-600 dark:text-gray-400">
            <code>
              <span className="text-brand-600 dark:text-brand-400">res</span>.cookie(<span className="text-emerald-600 dark:text-emerald-400">&quot;token&quot;</span>, token, {"{"}
              {"\n"}  httpOnly: <span className="text-amber-600 dark:text-amber-400">true</span>,
              {"\n"}  sameSite: <span className="text-emerald-600 dark:text-emerald-400">&quot;lax&quot;</span>,
              {"\n"}  secure: isProduction,
              {"\n"}{"}"});
            </code>
          </pre>
        </div>
        <div className="relative mt-10">
          <p className="font-mono text-xs uppercase tracking-widest text-brand-600 dark:text-brand-400">dev.log</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight">{t("auth.asideTitle")}</h2>
          <ul className="mt-8 space-y-4">
            {features.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
                  <Icon className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto w-full max-w-sm animate-fade-up">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-gray-500">{description}</p>
        <div className="mt-8">{children}</div>
        {footer && <p className="mt-8 text-center text-sm text-gray-500">{footer}</p>}
      </div>
    </div>
  );
}

export function Divider({ label }) {
  return (
    <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-gray-400">
      <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
      {label}
      <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
    </div>
  );
}
