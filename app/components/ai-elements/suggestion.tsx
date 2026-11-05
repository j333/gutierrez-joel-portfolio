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

const SuggestionArrow = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.25"
    strokeLinecap="square"
    strokeLinejoin="miter"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className="mt-[4px] size-3 shrink-0"
  >
    <path d="M2.75 1.75v6.25H9" />
    <path d="M6.75 5.75 9.25 8.25 6.75 10.75" />
  </svg>
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
        "flex min-h-11 w-full cursor-pointer items-start gap-2 rounded-sm px-0 py-1.5 text-left text-sm font-normal leading-5 whitespace-normal text-neutral-600 outline-none hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 disabled:pointer-events-none disabled:opacity-40 md:min-h-8 dark:text-neutral-400 dark:hover:text-white dark:focus-visible:outline-neutral-100",
        className
      )}
      onClick={handleClick}
      type={type}
      {...props}
    >
      <SuggestionArrow />
      <span className="min-w-0 flex-1">{children || suggestion}</span>
    </button>
  );
};
