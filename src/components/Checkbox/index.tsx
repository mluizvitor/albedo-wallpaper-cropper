import { CheckSquare, Square } from 'phosphor-react';
import styles from './styles.module.css';

interface CheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  value?: string;
  className?: string;
  triggerMethod?: () => void;
  bigCheckbox?: boolean;
}

export default function Checkbox({ checked, id, label, value, triggerMethod, className, bigCheckbox }: CheckboxProps) {

  return (
    <div className={[styles.checkboxContainer, 'group', className].join(' ')} >
      <input id={id}
        type='checkbox'
        className='opacity-0 absolute'
        checked={checked}
        value={value || ''}
        onChange={triggerMethod} />
      <div className={[styles.iconContainer, 'group-focus-within:ring-2'].join(' ')}>
        {checked ? (
          <CheckSquare size={bigCheckbox ? 24 : 16}
            weight='fill'
            className='text-yellow-400' />
        ) : (
          <Square size={bigCheckbox ? 24 : 16}
            weight='bold'
            className='text-neutral-300' />
        )}
      </div>
      <label htmlFor={id}
        className='w-full'>{label}</label>
    </div>
  );
}
