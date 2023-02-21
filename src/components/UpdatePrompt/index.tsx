import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Prompt } from '../Prompt';
import Button from '../Button';

export function UpdatePrompt() {

  const [promptUpdateIsOpen, setPrompUpdatetIsOpen] = useState(true);
  const [promptOfflineIsOpen, setPromptOfflineIsOpen] = useState(true);

  const {
    offlineReady: [offlineReady, setOfflineReady],
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

  function handleCloseUpdateDialog() {
    setNeedRefresh(false);
    setPrompUpdatetIsOpen(false);
  }

  function handleOpenUpdateDialog() {
    setPrompUpdatetIsOpen(true);
  }

  function handleCloseOfflineDialog() {
    setOfflineReady(false);
    setPromptOfflineIsOpen(false);
  }

  function handleOpenOfflineDialog() {
    setPromptOfflineIsOpen(true);
  }

  useEffect(() => {
    if (needRefresh) {
      handleOpenUpdateDialog();
    }
  }, [needRefresh]);

  useEffect(() => {
    if (offlineReady) {
      handleOpenOfflineDialog();
    }
  }, [offlineReady]);

  return (
    <>
      <Prompt promptTitle='Update available'
        open={promptUpdateIsOpen}
        onClose={handleCloseUpdateDialog}>

        <p className='mb-4'>
          {'Please, update Albedo Cropper to get the latest features and fixes.'}
        </p>

        <div className='grid grid-cols-2 gap-2'>
          <Button label='Update on next boot'
            onClick={handleCloseUpdateDialog}
          />

          <Button label='Update now'
            className='bg-amber-400 text-black/80'
            onClick={handleUpdate}
          />
        </div>
      </Prompt>

      <Prompt promptTitle='Ready to work offline!'
        open={promptOfflineIsOpen}
        onClose={handleCloseOfflineDialog}>
        <Button label='Close'
          className='w-full bg-amber-400 text-black/80'
          onClick={handleCloseOfflineDialog} />
      </Prompt>
    </>
  );
}