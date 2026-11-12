import { cn } from "../../lib/cn";

export default function Skeleton({ className }) {
  return <div className={cn("animate-pulse rounded-lg bg-gray-200/70 dark:bg-gray-800/70", className)} />;
}
