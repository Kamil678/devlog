export default function Divider({ label }) {
  return (
    <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wider text-gray-400">
      <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
      {label}
      <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
    </div>
  );
}
