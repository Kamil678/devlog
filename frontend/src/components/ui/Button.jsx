import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/cn";
import Spinner from "./Spinner";

const variants = {
  primary: "bg-gray-800 text-white hover:bg-gray-900 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 shadow-sm",
  accent: "bg-gray-800 text-white hover:bg-gray-900 dark:bg-brand-500 dark:text-gray-950 dark:hover:bg-brand-400 shadow-sm",
  brand: "bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-600/20",
  secondary:
    "border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800",
  ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100",
  danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
};

const sizes = {
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
  icon: "h-9 w-9",
};

const Button = forwardRef(function Button(
  { variant = "primary", size = "md", to, href, loading = false, disabled, className, children, ...props },
  ref,
) {
  const classes = cn(
    "inline-flex shrink-0 items-center justify-center rounded-lg font-medium transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );

  if (to) {
    return (
      <Link ref={ref} to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a ref={ref} href={href} className={classes} target="_blank" rel="noreferrer" {...props}>
        {children}
      </a>
    );
  }

  return (
    <button ref={ref} type="button" className={classes} disabled={disabled || loading} {...props}>
      {loading && <Spinner className="h-4 w-4" />}
      {children}
    </button>
  );
});

export default Button;
