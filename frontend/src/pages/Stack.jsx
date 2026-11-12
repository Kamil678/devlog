import { useTranslation } from "react-i18next";
import { BsGithub } from "react-icons/bs";
import {
  HiOutlineBeaker,
  HiOutlineChatBubbleLeftRight,
  HiOutlineEye,
  HiOutlineLanguage,
  HiOutlineLockClosed,
  HiOutlineShieldCheck,
  HiOutlineSquares2X2,
} from "react-icons/hi2";
import Button from "../components/ui/Button";
import Seo from "../components/ui/Seo";
import { site } from "../lib/site";

const techGroups = [
  { key: "frontend", items: ["React 18", "Vite", "React Router", "Redux Toolkit", "Tailwind CSS", "react-i18next", "Quill", "DOMPurify"] },
  { key: "backend", items: ["Node.js 20", "Express", "MongoDB", "Mongoose", "JWT", "zod", "helmet", "rate limit"] },
  { key: "services", items: ["MongoDB Atlas", "Firebase Auth", "Firebase Storage"] },
  { key: "quality", items: ["Vitest", "Supertest", "mongodb-memory-server", "ESLint"] },
];

const features = [
  { icon: HiOutlineLockClosed, key: "auth" },
  { icon: HiOutlineSquares2X2, key: "admin" },
  { icon: HiOutlineChatBubbleLeftRight, key: "comments" },
  { icon: HiOutlineShieldCheck, key: "security" },
  { icon: HiOutlineLanguage, key: "i18n" },
  { icon: HiOutlineBeaker, key: "tests" },
];

export default function Stack() {
  const { t } = useTranslation();
  const steps = t("stack.steps", { returnObjects: true });

  return (
    <>
      <Seo title={t("nav.howItWorks")} description={t("stack.description")} />
      <section className="relative overflow-hidden border-b border-gray-200 dark:border-gray-800">
        <div className="bg-dots absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
        <div className="container-page relative py-16 sm:py-24">
          <div className="max-w-3xl animate-fade-up">
            <p className="font-mono text-xs uppercase tracking-widest text-brand-600 dark:text-brand-400">{t("stack.eyebrow")}</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl">{t("stack.title")}</h1>
            <p className="mt-6 text-lg text-gray-600 text-pretty dark:text-gray-400">{t("stack.description")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={site.repo}>
                <BsGithub className="h-4 w-4" />
                {t("footer.sourceCode")}
              </Button>
              <Button to="/sign-in" variant="secondary">
                <HiOutlineEye className="h-4 w-4" />
                {t("stack.tryDemo")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <p className="font-mono text-xs uppercase tracking-widest text-brand-600 dark:text-brand-400">{t("stack.stackEyebrow")}</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{t("stack.stackTitle")}</h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {techGroups.map(({ key, items }) => (
            <div key={key}>
              <h3 className="text-sm font-semibold">{t(`stack.groups.${key}`)}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {items.map((item) => (
                  <li
                    key={item}
                    className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 font-mono text-xs text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-gray-200 bg-gray-50/60 py-16 dark:border-gray-800 dark:bg-gray-900/30">
        <div className="container-page">
          <p className="font-mono text-xs uppercase tracking-widest text-brand-600 dark:text-brand-400">{t("stack.flowEyebrow")}</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{t("stack.flowTitle")}</h2>
          <p className="mt-2 max-w-2xl text-gray-500 dark:text-gray-400">{t("stack.flowDescription")}</p>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.title} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-brand-600 dark:text-brand-400">{String(index + 1).padStart(2, "0")}</span>
                  <code className="font-mono text-sm font-semibold">{step.title}</code>
                </div>
                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-page py-16">
        <p className="font-mono text-xs uppercase tracking-widest text-brand-600 dark:text-brand-400">{t("stack.featuresEyebrow")}</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{t("stack.featuresTitle")}</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, key }) => (
            <div key={key} className="rounded-2xl border border-gray-200 p-5 dark:border-gray-800">
              <Icon className="h-5 w-5 text-brand-600 dark:text-brand-400" />
              <h3 className="mt-3 font-semibold">{t(`stack.features.${key}.title`)}</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t(`stack.features.${key}.desc`)}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
