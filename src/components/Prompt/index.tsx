import { Dialog } from '@headlessui/react';
import { X } from 'phosphor-react';
import { ReactNode } from 'react';
import Button from '../Button';

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
        <Dialog.Panel className='w-full max-w-sm bg-neutral-700 p-4 border border-neutral-600 ring-1 ring-black/50 rounded-xl shadow-xl shadow-black/30 relative'>

          <Button label='Close'
            hideLabel
            icon={<X size={16}
              weight='bold' />}
            onClick={onClose}
            className='absolute top-3 right-3 shadow-none bg-transparent hover:bg-white/10' />

          <Dialog.Title className='text-lg leading-6 mr-7 mb-4'>
            {promptTitle || 'This is a placeholder text.'}
          </Dialog.Title>

          <hr className='border-neutral-500 -mx-4 mb-4' />

          {children}

        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
