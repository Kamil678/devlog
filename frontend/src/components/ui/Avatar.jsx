import { useState } from "react";
import { cn } from "../../lib/cn";

const sizes = { sm: "h-7 w-7 text-xs", md: "h-9 w-9 text-sm", lg: "h-12 w-12 text-base", xl: "h-28 w-28 text-3xl" };

export default function Avatar({ src, name = "", size = "md", className }) {
  const [failed, setFailed] = useState(false);
  const initials = name.slice(0, 2).toUpperCase() || "?";

  return src && !failed ? (
    <img
      src={src}
      alt={name}
      onError={() => setFailed(true)}
      referrerPolicy="no-referrer"
      className={cn("shrink-0 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-800", sizes[size], className)}
    />
  ) : (
    <span
      aria-label={name}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700 dark:bg-brand-500/15 dark:text-brand-300",
        sizes[size],
        className
      )}
    >
      {initials}
    </span>
  );
}
