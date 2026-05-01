import Link from "next/link";
import { type ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  className?: string;
  href?: string;
  type?: "button" | "submit";
  variant?: "primary" | "blue" | "outline" | "ghost" | "danger";
  disabled?: boolean;
};

const variants = {
  primary: "btn-primary-cta hover:bg-[#4D5977] text-white",
  blue: "bg-[#0066CC] hover:bg-[#0052A3] text-white",
  outline: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50",
  ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
  danger: "bg-red-600 hover:bg-red-700 text-white"
};

export function Button({
  children,
  className = "",
  href,
  type = "button",
  variant = "primary",
  disabled = false
}: ButtonProps) {
  const classes = `inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors focus-ring disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} disabled={disabled}>
      {children}
    </button>
  );
}
