import { CaretUp } from 'phosphor-react';
import { ReactNode, useState } from 'react';

interface SectionSeparatorProps {
  title: string;
  className?: string;
  closed?: boolean;
  children: ReactNode;
}

export function MenuSection({ title, className, closed = false, children }: SectionSeparatorProps) {

  const [isMenuSectionOpen, setIsMenuSectionOpen] = useState(!closed);

  function toggleMenuSection() {
    setIsMenuSectionOpen(!isMenuSectionOpen);
  }

  return (
    <div>
      <div className='pb-1 pt-2 px-6 bg-neutral-700 text-neutral-50 border-b border-b-neutral-600 flex cursor-pointer items-center'
        onClick={toggleMenuSection}>
        <span className='text-bold font-teko uppercase grow'>
          {title}
        </span>
        <CaretUp size={16}
          weight='bold'
          className={['shrink-0', !isMenuSectionOpen && 'rotate-180'].join(' ')}
        />
      </div>
      <div className={['p-4', !isMenuSectionOpen && 'hidden', className].join(' ')}>
        {children}
      </div>
    </div>
  );
}
