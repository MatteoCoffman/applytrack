import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
};

const variants = {
  primary:
    "bg-blue-500 text-white hover:bg-blue-400 border border-blue-400/50",
  secondary:
    "bg-white/5 text-slate-100 hover:bg-white/10 border border-white/10",
  danger:
    "bg-red-500/15 text-red-200 hover:bg-red-500/25 border border-red-400/30",
  ghost: "bg-transparent text-slate-300 hover:text-white hover:bg-white/5 border border-transparent",
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
