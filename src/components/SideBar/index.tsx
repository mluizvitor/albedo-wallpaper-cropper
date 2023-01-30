import { ReactNode } from "react";

interface SideBarProps {
  anchor: "left" | "right";
  children: ReactNode;
  className?: string;
}

export function SideBar({ anchor, className, children }: SideBarProps) {
  return (
    <section className={["max-w-[16rem] xl:max-w-sm bg-neutral-800 border-neutral-600 w-full fixed top-0 inset-y-0",
      anchor === "left" ? "left-0 border-r" : "right-0 border-l",
      className
    ].join(" ")}>
      {children}
    </section>
  )
}
