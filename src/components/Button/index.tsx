import { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

import styles from './styles.module.css';

interface ButtonProps extends ComponentPropsWithoutRef<ElementType> {
  label: string;
  icon?: ReactNode;
  className?: string;
  hideLabel?: boolean;
}

export default function Button({ label, icon, className, hideLabel, ...rest }: ButtonProps) {
  return (
    <button className={[styles.buttonHexagon, className].join(' ')}
      {...rest}>
      {icon && icon}
      {!hideLabel && (
        <span className={icon ? 'ml-3' : ''}>
          {label}
        </span>
      )}
    </button>
  );
}
