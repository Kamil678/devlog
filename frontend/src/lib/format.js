import i18n from "./i18n";

const locale = () => (i18n.resolvedLanguage === "pl" ? "pl-PL" : "en-US");

export const formatDate = (value, options = { day: "numeric", month: "short", year: "numeric" }) =>
  new Intl.DateTimeFormat(locale(), options).format(new Date(value));

const units = [
  ["year", 31536000],
  ["month", 2592000],
  ["week", 604800],
  ["day", 86400],
  ["hour", 3600],
  ["minute", 60],
];

export const timeAgo = (value) => {
  const seconds = Math.round((new Date(value).getTime() - Date.now()) / 1000);
  const rtf = new Intl.RelativeTimeFormat(locale(), { numeric: "auto" });
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) return rtf.format(Math.round(seconds / size), unit);
  }
  return rtf.format(0, "minute");
};

export const stripHtml = (html = "") => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

export const readingTime = (html) => Math.max(1, Math.round(stripHtml(html).split(" ").length / 200));

export const excerpt = (html, length = 160) => {
  const text = stripHtml(html);
  return text.length > length ? `${text.slice(0, length).trimEnd()}…` : text;
};
