import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-carbon-blue-60)] text-white hover:bg-[var(--color-carbon-blue-70)] active:bg-[var(--color-carbon-blue-80)]",
        destructive:
          "bg-[var(--color-carbon-danger-60)] text-white hover:bg-[#ba1b23]",
        outline:
          "border border-[var(--color-carbon-blue-60)] bg-transparent text-[var(--color-carbon-blue-60)] hover:bg-[var(--color-carbon-blue-60)] hover:text-white",
        secondary:
          "bg-[var(--color-carbon-gray-80)] text-white hover:bg-[var(--color-carbon-gray-90)]",
        ghost: "hover:bg-[var(--color-carbon-gray-20)] hover:text-[var(--color-carbon-gray-100)]",
        link: "text-[var(--color-carbon-blue-60)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-4 py-2",
        sm: "h-10 px-3",
        lg: "h-14 px-8",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
