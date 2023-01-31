import { Dialog } from '@headlessui/react';
import { X } from 'phosphor-react';
import { ReactNode } from 'react';

interface PromptProps {
  open: boolean;
  onClose: () => void;
  promptTitle: string;
  children?: ReactNode;
}

export function Prompt({ open, onClose, promptTitle, children }: PromptProps) {

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className='relative z-50'
    >
      <div className='bg-black/50 fixed inset-0' />
      <div className='fixed inset-0 flex items-center justify-center p-4'>
        <Dialog.Panel className='w-full max-w-sm bg-stone-700 p-4 rounded-2xl shadow-xl grid gap-4 relative'>
          <button className='bg-white/10 absolute p-2 rounded-full top-3 right-3'
            onClick={onClose}>
            <X size={16}
              weight='bold' />
          </button>

          <Dialog.Title className='text-lg leading-6'>
            {promptTitle || 'This is a placeholder text.'}
          </Dialog.Title>

          <hr className='border-yellow-500' />

          {children}

        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
