import { cn } from "@/lib/utils";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive' | 'outline';
}

export function Button({ className, variant = 'default', children, ...props }: ButtonProps) {
    return (
        <button
            className={cn(
                "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "disabled:opacity-50 disabled:pointer-events-none",
                variant === 'default' && "bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4",
                variant === 'destructive' && "bg-red-600 text-white hover:bg-red-700 h-10 py-2 px-4",
                variant === 'outline' && "border border-border bg-background hover:bg-muted h-10 py-2 px-4",
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
