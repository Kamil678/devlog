import { forwardRef, useId } from "react";
import { cn } from "../../lib/cn";

const controlClasses =
  "w-full rounded-lg border bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:bg-gray-900 dark:text-gray-100 disabled:opacity-60";

const stateClasses = (error) =>
  error
    ? "border-red-400 focus:border-red-500 dark:border-red-500/70"
    : "border-gray-200 focus:border-brand-500 dark:border-gray-800 dark:focus:border-brand-500";

function FieldWrapper({ id, label, hint, error, children, className }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : (
        hint && <p className="text-xs text-gray-500">{hint}</p>
      )}
    </div>
  );
}

export const Input = forwardRef(function Input({ label, hint, error, className, inputClassName, icon: Icon, trailing, ...props }, ref) {
  const generatedId = useId();
  const id = props.id || generatedId;

  return (
    <FieldWrapper id={id} label={label} hint={hint} error={error} className={className}>
      <div className="relative">
        {Icon && <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />}
        <input
          ref={ref}
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(controlClasses, stateClasses(error), "h-10", Icon && "pl-9", inputClassName)}
          {...props}
        />
        {trailing && <div className="absolute right-2 top-1/2 -translate-y-1/2">{trailing}</div>}
      </div>
    </FieldWrapper>
  );
});

export const Textarea = forwardRef(function Textarea({ label, hint, error, className, ...props }, ref) {
  const generatedId = useId();
  const id = props.id || generatedId;

  return (
    <FieldWrapper id={id} label={label} hint={hint} error={error} className={className}>
      <textarea
        ref={ref}
        id={id}
        aria-invalid={Boolean(error)}
        className={cn(controlClasses, stateClasses(error), "min-h-[96px] resize-y py-2.5")}
        {...props}
      />
    </FieldWrapper>
  );
});

export const Select = forwardRef(function Select({ label, hint, error, className, children, ...props }, ref) {
  const generatedId = useId();
  const id = props.id || generatedId;

  return (
    <FieldWrapper id={id} label={label} hint={hint} error={error} className={className}>
      <select ref={ref} id={id} className={cn(controlClasses, stateClasses(error), "h-10 pr-8")} {...props}>
        {children}
      </select>
    </FieldWrapper>
  );
});
