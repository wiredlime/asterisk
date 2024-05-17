import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import React, { ButtonHTMLAttributes } from "react";

const buttonVariants = cva("active:scale-95", {
  variants: {
    variant: { default: "bg-primary", ghost: "bg-secondary" },
    size: { default: "p-4", sm: "p-2" },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface MyButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

function MyButton({
  className,
  children,
  variant,
  size,
  isLoading,
  ...props
}: MyButtonProps) {
  return (
    <button
      disabled={isLoading}
      {...props}
      className={cn(buttonVariants({ variant, size, className }))}
    >
      {isLoading ? <Loader2 /> : null}
      {children}
    </button>
  );
}

export default MyButton;
