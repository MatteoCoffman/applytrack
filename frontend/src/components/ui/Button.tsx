import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
};

const variants = {
  primary:
    "bg-emerald-600 text-white hover:bg-emerald-500 border border-emerald-500/50 shadow-sm shadow-emerald-600/20",
  secondary:
    "bg-white text-slate-700 hover:bg-emerald-50 border border-emerald-200 hover:border-emerald-300",
  danger:
    "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200",
  ghost:
    "bg-transparent text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border border-transparent",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
