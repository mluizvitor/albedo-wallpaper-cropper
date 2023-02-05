import { ReactNode } from 'react';

interface SideBarProps {
  anchor: 'left' | 'right';
  children: ReactNode;
  className?: string;
}

export function SideBar({ anchor, className, children }: SideBarProps) {
  return (
    <section className={['max-w-sm 2xl:max-w-md bg-neutral-800 border-neutral-600 w-full fixed z-10 top-0 inset-y-0 overflow-y-auto',
      anchor === 'left' ? 'left-0 border-r' : 'right-0 border-l',
      className
    ].join(' ')}>
      {children}
    </section>
  );
}
