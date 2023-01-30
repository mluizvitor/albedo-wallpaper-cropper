import { ComponentPropsWithoutRef, ElementType, HTMLInputTypeAttribute } from "react";
import styles from "./styles.module.css";

interface InputProps extends ComponentPropsWithoutRef<ElementType> {
  id: string;
  label: string;
  helperText?: string;
  placeholder?: string;
  type: HTMLInputTypeAttribute;
  className?: string;
}

export default function Input({ id, label, helperText, placeholder, type, className, ...rest }: InputProps) {
  return (
    <div className={[styles.inputContainer, className].join(" ")}>

      <label htmlFor={id} className={styles.inputLabel}>{label}</label>

      <input id={id} type={type} {...rest} placeholder={placeholder}
        className={styles.inputText}
        onFocus={(e) => { e.target.select() }} />
      {helperText && <span className="opacity-70 leading-[100%] mt-2 text-xs ml-2 w-auto">{helperText}</span>}
    </div>
  )
}
