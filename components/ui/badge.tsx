import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center border px-2.5 py-0.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-accent text-accent-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        success: "border-transparent bg-[var(--success-bg)] text-[var(--success)]",
        warning: "border-transparent bg-[var(--warning-bg)] text-[var(--warning-foreground)]",
        info: "border-transparent bg-[var(--info-bg)] text-[var(--info)]",
        destructive: "border-transparent bg-[var(--destructive-bg)] text-destructive",
      },
      shape: {
        default: "rounded-md",
        // px-3 overrides the base px-2.5 via tailwind-merge in cn() — keep cn(), not clsx
        pill: "rounded-full px-3",
      },
    },
    defaultVariants: { variant: "default", shape: "default" },
  }
)

function Badge({
  className,
  variant = "default",
  shape = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant, shape }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
