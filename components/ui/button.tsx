import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline' | 'ghost' | 'destructive'
    size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', size = 'default', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50",
                    {
                        "bg-blue-600 text-white shadow hover:bg-blue-700 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700": variant === 'default',
                        "border border-gray-300 bg-white text-gray-900 shadow-sm hover:bg-gray-100 hover:text-gray-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-50": variant === 'outline',
                        "text-gray-900 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-50": variant === 'ghost',
                        "bg-red-500 text-white shadow-sm hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700": variant === 'destructive',
                        "h-10 px-4 py-2": size === 'default',
                        "h-8 rounded-md px-3 text-xs": size === 'sm',
                        "h-12 rounded-md px-8": size === 'lg',
                        "h-10 w-10": size === 'icon',
                    },
                    className
                )}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
