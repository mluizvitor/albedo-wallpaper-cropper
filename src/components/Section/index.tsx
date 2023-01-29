import { ReactNode } from "react";

interface SectionSeparatorProps {
  title: string;
  className?: string;
  children: ReactNode;
}

export function MenuSection({ title, className, children }: SectionSeparatorProps) {
  return (
    <div>
      <div className="pb-1 pt-2 px-6 bg-stone-700 text-sm text-stone-50 border-b border-b-stone-600">
        <span className="text-bold">
          {title}
        </span>
      </div>
      <div className={["m-4", className].join(" ")}>
        {children}
      </div>
    </div>
  )
}
