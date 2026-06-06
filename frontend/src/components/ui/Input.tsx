import { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function Input({ label, id, className = "", ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <label htmlFor={inputId} className="block space-y-2 text-sm">
      <span className="font-medium text-slate-200">{label}</span>
      <input
        id={inputId}
        className={`w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-blue-400/60 focus:bg-white/10 ${className}`}
        {...props}
      />
    </label>
  );
}
