import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Prompt } from '../Prompt';
import Button from '../Button';

export function UpdatePrompt() {

  const [promptIsOpen, setPromptIsOpen] = useState(false);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,

  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {

      if (import.meta.env.VITE_APP_ENVIRONMENT === 'dev') {
        console.log(`Service Worker at: ${swUrl}`);
        console.log('Checking for sw update');
      }

      if (r) {
        r.update();
      };

    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  function handleUpdate() {
    updateServiceWorker(true);
  }

  function handleCloseDialog() {
    setNeedRefresh(false);
  }

  function handleOpenDialog() {
    setPromptIsOpen(true);
  }

  useEffect(() => {
    if (needRefresh) {
      handleOpenDialog();
      console.log(needRefresh);
    }
  }, [needRefresh]);

  return (
    <Prompt promptTitle='Update available'
      open={promptIsOpen}
      onClose={handleCloseDialog}>

      <div>
        <span>
          {'Please, update Albedo Cropper to get the latest features and fixes.'}
        </span>
      </div>

      <div className='grid grid-cols-2 gap-2'>
        <Button label='Update on next boot'
          onClick={handleCloseDialog}
        />

        <Button label='Update now'
          className='bg-yellow-400 text-black/80'
          onClick={handleUpdate}
        />
      </div>
    </Prompt>
  );
}