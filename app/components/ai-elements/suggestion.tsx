"use client";

import { cn } from "app/lib/utils";
import type { ComponentProps } from "react";
import { useCallback } from "react";

export type SuggestionsProps = ComponentProps<"div">;

export const Suggestions = ({
  className,
  children,
  ...props
}: SuggestionsProps) => (
  <div className={cn("grid w-full text-left", className)} {...props}>
    {children}
  </div>
);

export type SuggestionProps = Omit<ComponentProps<"button">, "onClick"> & {
  suggestion: string;
  onClick?: (suggestion: string) => void;
};

export const Suggestion = ({
  suggestion,
  onClick,
  className,
  children,
  type = "button",
  ...props
}: SuggestionProps) => {
  const handleClick = useCallback(() => {
    onClick?.(suggestion);
  }, [onClick, suggestion]);

  return (
    <button
      className={cn(
        "min-h-11 w-full cursor-pointer rounded-sm px-0 py-1.5 text-left text-sm font-normal leading-5 whitespace-normal text-neutral-600 outline-none hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 disabled:pointer-events-none disabled:opacity-40 md:min-h-8 dark:text-neutral-400 dark:hover:text-white dark:focus-visible:outline-neutral-100",
        className
      )}
      onClick={handleClick}
      type={type}
      {...props}
    >
      {children || suggestion}
    </button>
  );
};
