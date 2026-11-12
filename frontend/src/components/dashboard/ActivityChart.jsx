import { useState } from "react";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../lib/format";
import { cn } from "../../lib/cn";

const WIDTH = 560;
const HEIGHT = 220;
const PAD = { top: 16, right: 8, bottom: 28, left: 32 };
const BAR = 24;

const niceMax = (value) => {
  if (value <= 4) return 4;
  const step = Math.pow(10, Math.floor(Math.log10(value)));
  return Math.ceil(value / step) * step;
};

export default function ActivityChart({ months }) {
  const { t } = useTranslation();
  const [metric, setMetric] = useState("posts");
  const [hover, setHover] = useState(null);

  const metrics = ["posts", "comments", "users"];
  const values = months.map((m) => m[metric]);
  const max = niceMax(Math.max(...values, 1));
  const ticks = [0, max / 2, max];
  const plotW = WIDTH - PAD.left - PAD.right;
  const plotH = HEIGHT - PAD.top - PAD.bottom;
  const band = plotW / months.length;
  const y = (v) => PAD.top + plotH - (v / max) * plotH;
  const monthLabel = (key) => formatDate(`${key}-01T00:00:00Z`, { month: "short", timeZone: "UTC" });

  return (
    <div className="rounded-2xl border border-gray-200 p-5 dark:border-gray-800">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold">{t("dashboard.activityTitle")}</h3>
          <p className="text-sm text-gray-500">{t(`dashboard.activitySubtitle.${metric}`)}</p>
        </div>
        <div role="group" aria-label={t("dashboard.metric")} className="flex rounded-lg border border-gray-200 p-0.5 text-xs dark:border-gray-800">
          {metrics.map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={metric === m}
              onClick={() => setMetric(m)}
              className={cn(
                "rounded-md px-2.5 py-1 transition-colors",
                metric === m ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900" : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              {t(`dashboard.${m}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mt-4">
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-auto w-full" role="img" aria-label={t(`dashboard.activitySubtitle.${metric}`)}>
          {ticks.map((tick) => (
            <g key={tick}>
              <line x1={PAD.left} x2={WIDTH - PAD.right} y1={y(tick)} y2={y(tick)} className="stroke-gray-200 dark:stroke-gray-800" strokeWidth="1" />
              <text x={PAD.left - 8} y={y(tick)} dy="0.32em" textAnchor="end" className="fill-gray-400 font-mono text-[10px]">
                {tick}
              </text>
            </g>
          ))}
          {months.map((m, i) => {
            const value = m[metric];
            const x = PAD.left + i * band + (band - BAR) / 2;
            const top = y(value);
            const h = PAD.top + plotH - top;
            const r = Math.min(4, h);
            const path =
              h > 0
                ? `M${x},${top + h} V${top + r} Q${x},${top} ${x + r},${top} H${x + BAR - r} Q${x + BAR},${top} ${x + BAR},${top + r} V${top + h} Z`
                : null;
            return (
              <g key={m.month} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
                <rect x={PAD.left + i * band} y={PAD.top} width={band} height={plotH} fill="transparent" />
                {path && <path d={path} fill="#0891b2" opacity={hover === null || hover === i ? 1 : 0.45} className="transition-opacity" />}
                <text x={PAD.left + i * band + band / 2} y={HEIGHT - 8} textAnchor="middle" className="fill-gray-500 text-[11px]">
                  {monthLabel(m.month)}
                </text>
              </g>
            );
          })}
        </svg>
        {hover !== null && (
          <div
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs shadow-lg dark:border-gray-700 dark:bg-gray-900"
            style={{
              left: `${((PAD.left + hover * band + band / 2) / WIDTH) * 100}%`,
              top: `${(Math.max(y(values[hover]), PAD.top + 20) / HEIGHT) * 100}%`,
            }}
          >
            <p className="text-gray-500">{monthLabel(months[hover].month)}</p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {values[hover]} {t(`dashboard.${metric}`).toLowerCase()}
            </p>
          </div>
        )}
      </div>

      <table className="sr-only">
        <caption>{t(`dashboard.activitySubtitle.${metric}`)}</caption>
        <tbody>
          {months.map((m) => (
            <tr key={m.month}>
              <th scope="row">{monthLabel(m.month)}</th>
              <td>{m[metric]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
