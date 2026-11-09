import { Link } from "react-router-dom";
import { cn } from "../../lib/cn";

export default function Logo({ className }) {
  return (
    <Link to="/" className={cn("group inline-flex items-center gap-2 font-semibold tracking-tight", className)}>
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 font-mono text-sm text-white transition-transform group-hover:-rotate-6">
        D
      </span>
      <span>
        dev<span className="text-brand-600 dark:text-brand-400">.log</span>
      </span>
    </Link>
  );
}
