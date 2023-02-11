import { CropperSection } from './sections/CropperSection';
import { CanvasSection } from './sections/CanvasSection';
import FileListSection from './sections/FileListSection';
import IDB from './database/config';
import { CircleNotch } from 'phosphor-react';
import { useLoader } from './hooks/useLoader';

function App() {
  const { loaderIsOn } = useLoader();

  IDB();

  return (
    <main>
      <CanvasSection />
      <CropperSection />
      <FileListSection />
      {loaderIsOn && (
        <div className='fixed inset-0 bg-neutral-900/50 flex flex-col items-center justify-center backdrop-blur-lg z-50'>
          <CircleNotch size={96}
            className='animate-spin' />

          <span className='font-teko text-xl'>
            {'Please wait...'}
          </span>
        </div>
      )}
    </main>
  );
}

export default App;
