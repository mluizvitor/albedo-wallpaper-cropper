import { ComponentPropsWithoutRef, ElementType, HTMLInputTypeAttribute } from "react";
import { selectSystemNameInput } from "../../utils/SelectInput";

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
    <div className={[type === "checkbox" ? "flex-row-reverse items-center" : "flex-col", "flex justify-center", className].join(" ")}>

      <label htmlFor={id} className={["leading-[100%] w-full text-sm ml-2 font-semibold", type !== 'checkbox' && 'mb-2'].join(" ")}>{label}</label>

      <input id={id} type={type} {...rest} placeholder={placeholder}
        className={type !== 'checkbox' ? "px-2 py-1 rounded-lg w-full h-10 bg-gray-800 border border-gray-600" : ""} onFocus={(e) => { e.target.select() }} />
      {helperText && <span className="opacity-70 leading-[100%] mt-2 text-xs ml-2 w-auto">{helperText}</span>}
    </div>
  )
}
