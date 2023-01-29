import { Plus } from 'phosphor-react'
import { ButtonHTMLAttributes, ComponentPropsWithoutRef, ElementType, HTMLProps, ReactNode } from 'react';

import styles from './styles.module.css';

interface ButtonProps extends ComponentPropsWithoutRef<ElementType> {
  label: string;
  icon?: ReactNode;
  className?: string;
}

export default function Button({ label, icon, className, ...rest }: ButtonProps) {
  return (
    <button className={[styles.buttonHexagon, className].join(" ")} {...rest}>
      {icon && icon}
      <span className={icon ? 'ml-3' : ""}>
        {label}
      </span>
    </button>
  )
}