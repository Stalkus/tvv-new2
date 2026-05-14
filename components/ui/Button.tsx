import Link from "next/link";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "outline" | "outline-light" | "gold" | "link";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
}

const base =
  "inline-flex items-center justify-center gap-2 font-bold uppercase tracking-[0.1em] rounded-full transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:opacity-50 disabled:pointer-events-none hover:-translate-y-0.5";

const variants: Record<Variant, string> = {
  primary: "bg-teal text-white shadow-[0_8px_20px_rgba(14,99,92,0.2)] hover:shadow-[0_12px_24px_rgba(14,99,92,0.3)] hover:bg-teal-hover",
  ghost: "bg-transparent text-teal hover:bg-teal/10 hover:shadow-none hover:translate-y-0 tracking-widest",
  outline: "border border-line-strong bg-white text-ink shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:border-teal hover:text-teal hover:shadow-[0_8px_20px_rgba(0,0,0,0.05)]",
  "outline-light": "border border-white/40 text-white backdrop-blur-sm hover:bg-white/10 hover:border-white hover:shadow-[0_8px_20px_rgba(255,255,255,0.1)]",
  gold: "bg-gold text-white shadow-[0_8px_20px_rgba(197,160,89,0.2)] hover:shadow-[0_12px_24px_rgba(197,160,89,0.3)] hover:bg-gold/90",
  link: "text-teal hover:text-teal-hover underline-offset-4 hover:underline px-0 hover:translate-y-0 hover:shadow-none font-medium normal-case tracking-normal",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-5 text-[11px]",
  md: "h-12 px-7 text-[12px]",
  lg: "h-14 px-8 text-[13px]",
};

interface ButtonProps extends BaseProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", fullWidth, className, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], fullWidth && "w-full", className)}
      {...props}
    >
      {children}
    </button>
  );
});

interface ButtonLinkProps extends BaseProps {
  href: string;
  target?: string;
  rel?: string;
  "aria-label"?: string;
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  const isExternal = href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");
  const cls = cn(base, variants[variant], sizes[size], fullWidth && "w-full", className);
  if (isExternal) {
    return (
      <a href={href} className={cls} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  );
}
