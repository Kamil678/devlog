export default function PageHeader({ eyebrow, title, description, children }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="mb-2 font-mono text-xs uppercase tracking-widest text-brand-600 dark:text-brand-400">{eyebrow}</p>}
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-gray-500 dark:text-gray-400">{description}</p>}
      </div>
      {children}
    </div>
  );
}
