import { ComponentPropsWithoutRef, ElementType, HTMLInputTypeAttribute } from 'react';
import styles from './styles.module.css';

interface InputProps extends ComponentPropsWithoutRef<ElementType> {
  id: string;
  label: string;
  helperText?: string;
  placeholder?: string;
  type: HTMLInputTypeAttribute;
  className?: string;
  inputClassName?: string;
}

export default function Input({ id, label, helperText, placeholder, type, className, inputClassName, ...rest }: InputProps) {
  return (
    <div className={[styles.inputContainer, className].join(' ')}>

      {label && (
        <label htmlFor={id}
          className={styles.inputLabel}>{label}</label>
      )}

      <input id={id}
        type={type}
        {...rest}
        placeholder={placeholder}
        className={[type === 'range' ? '' : styles.inputText, inputClassName].join(' ')}
        onFocus={(e) => { e.target.select(); }} />
      {helperText && <span className='opacity-70 leading-[100%] mt-2 text-xs w-auto'>{helperText}</span>}
    </div>
  );
}
