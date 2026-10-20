import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "./Spinner";

const VARIANTS = {
  primary: "lift border-2 border-ink bg-ink text-white",
  lime: "lift border-2 border-ink bg-lime text-ink",
  outline: "lift border-2 border-ink bg-white text-ink",
  violet: "lift border-2 border-ink bg-violet text-white",
  danger: "lift border-2 border-ink bg-danger text-white",
  ghost: "border-2 border-transparent text-ink hover:bg-sand",
  subtle: "border border-line-strong bg-white text-ink hover:border-ink",
} as const;

const SIZES = {
  sm: "min-h-10 px-4 text-sm",
  md: "min-h-12 px-5 text-[15px]",
  lg: "min-h-14 px-7 text-base",
} as const;

export type ButtonVariant = keyof typeof VARIANTS;

type CommonProps = {
  variant?: ButtonVariant;
  size?: keyof typeof SIZES;
  shape?: "pill" | "rounded";
  loading?: boolean;
  icon?: ReactNode;
  className?: string;
  children?: ReactNode;
};

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type LinkProps = CommonProps & { href: string; target?: string; rel?: string; onClick?: () => void; "aria-label"?: string };

export function buttonClasses({ variant = "primary", size = "md", shape = "pill", className }: CommonProps = {}) {
  return cn(
    "inline-flex select-none items-center justify-center gap-2 font-semibold whitespace-nowrap transition-colors",
    "disabled:pointer-events-none disabled:opacity-60",
    shape === "pill" ? "rounded-full" : "rounded-xl",
    VARIANTS[variant],
    SIZES[size],
    className,
  );
}

export function Button(props: ButtonProps | LinkProps) {
  const { variant, size, shape, loading, icon, className, children, ...rest } = props;
  const classes = buttonClasses({ variant, size, shape, className });
  const inner = (
    <>
      {loading ? <Spinner className="size-4" /> : icon}
      {children}
    </>
  );

  if ("href" in rest && rest.href) {
    const { href, ...linkRest } = rest as LinkProps;
    return (
      <Link href={href} className={classes} {...linkRest}>
        {inner}
      </Link>
    );
  }

  const buttonRest = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type="button" className={classes} disabled={loading || buttonRest.disabled} {...buttonRest}>
      {inner}
    </button>
  );
}
