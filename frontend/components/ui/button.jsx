import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-slate-300",
	{
		variants: {
			variant: {
				default: "bg-teal-600 text-white shadow hover:bg-teal-600/90 ",
				destructive:
					"bg-red-500 text-slate-50 shadow-sm hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90",
				outline:
					"border border-slate-400 bg-white shadow-sm hover:bg-slate-200 hover:text-slate-900 hover:border-slate-400 dark:border-slate-800 dark:bg-slate-100/90 dark:hover:border-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-50 text-slate-900",
				secondary:
					"border border-slate-300 bg-slate-800 text-neutral-50 shadow-sm hover:bg-slate-800/90 dark:bg-slate-100 dark:text-slate-800 dark:hover:bg-slate-800/80 dark:hover:text-neutral-50",
				ghost:
					"hover:bg-slate-200 hover:text-slate-900 dark:hover:bg-slate-400 dark:hover:text-slate-800",
				link: "text-slate-900 underline-offset-4 hover:underline dark:text-slate-50"
			},
			size: {
				default: "h-9 px-4 py-2",
				sm: "h-8 rounded-md px-2 py-4 text-xs",
				lg: "h-10 rounded-md p-4",
				icon: "h-9 w-9"
			}
		},
		defaultVariants: {
			variant: "default",
			size: "default"
		}
	}
);

const Button = React.forwardRef(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	}
);
Button.displayName = "Button";

export { Button, buttonVariants };
