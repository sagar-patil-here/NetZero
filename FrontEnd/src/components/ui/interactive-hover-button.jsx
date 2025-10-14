import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const InteractiveHoverButton = React.forwardRef(({ text = "Button", className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "group relative inline-flex cursor-pointer overflow-hidden rounded-full border border-white/20 bg-black/20 backdrop-blur-md px-8 py-2 text-center font-semibold text-white hover:bg-black/30 transition-all duration-500",
        className,
      )}
      {...props}
    >
      <span className="inline-block transition-all duration-1000 group-hover:translate-x-12 group-hover:opacity-0 whitespace-nowrap">
        {text}
      </span>
      <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 text-white opacity-0 transition-all duration-1000 group-hover:opacity-100">
        <span className="whitespace-nowrap">{text}</span>
        <ArrowRight className="text-white w-4 h-4" />
      </div>
      <div className="absolute left-1/2 top-1/2 h-0 w-0 scale-[1] rounded-lg bg-primary-500 transition-all duration-700 group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[1.8] group-hover:bg-primary-500"></div>
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export { InteractiveHoverButton };
