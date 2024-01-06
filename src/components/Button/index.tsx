import { ComponentPropsWithoutRef, ElementType, ReactElement, cloneElement } from 'react';

import styles from './styles.module.css';

interface ButtonProps extends ComponentPropsWithoutRef<ElementType> {
  label: string;
  icon?: ReactElement;
  className?: string;
  hideLabel?: boolean;
}

export default function Button({ label, icon, className, hideLabel, ...rest }: ButtonProps) {
  return (
    <button className={[styles.button, className].join(' ')}
      title={label}
      {...rest}>
      {icon && cloneElement(icon, {
        className: ['shrink-0', icon.props.className].join(' '),
      })}
      {!hideLabel && (
        <span className={icon ? 'ml-2' : ''}>
          {label}
        </span>
      )}
    </button>
  );
}
