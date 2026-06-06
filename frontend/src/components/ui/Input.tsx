import { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  /** Label beside the input instead of above it */
  inline?: boolean;
};

const inputClassName =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-blue-400/60 focus:bg-white/10";

export function Input({
  label,
  id,
  className = "",
  inline = false,
  ...props
}: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  if (inline) {
    return (
      <div className="flex items-center gap-2.5 text-sm">
        <label htmlFor={inputId} className="shrink-0 font-medium text-slate-200">
          {label}
        </label>
        <input id={inputId} className={`${inputClassName} ${className}`} {...props} />
      </div>
    );
  }

  return (
    <label htmlFor={inputId} className="block space-y-2 text-sm">
      <span className="font-medium text-slate-200">{label}</span>
      <input id={inputId} className={`${inputClassName} ${className}`} {...props} />
    </label>
  );
}
