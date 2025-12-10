import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow hover:shadow-lg hover:shadow-rose-500/25 hover:-translate-y-0.5",
        destructive: "bg-gradient-to-r from-red-600 to-red-500 text-white shadow hover:shadow-lg hover:shadow-red-500/25 hover:-translate-y-0.5",
        success: "bg-gradient-to-r from-green-600 to-green-500 text-white shadow hover:shadow-lg hover:shadow-green-500/25 hover:-translate-y-0.5",
        outline: "border border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30",
        secondary: "bg-white/20 text-white hover:bg-white/30",
        ghost: "text-white/70 hover:bg-white/10 hover:text-white",
        link: "text-rose-400 underline-offset-4 hover:underline hover:text-rose-300",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-6 text-base",
        icon: "h-10 w-10",
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
