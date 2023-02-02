import { CropperSection } from './Sections/CropperSection';
import { CanvasSection } from './Sections/CanvasSection';
import FileListSection from './Sections/FileListSection';
import IDB from './database/config';
import { useCanvas } from './hooks/useCanvas';
import { CircleNotch } from 'phosphor-react';

function App() {
  const { showLoader } = useCanvas();

  IDB();

  return (
    <main>
      <CanvasSection />
      <CropperSection />
      <FileListSection />
      {showLoader && (
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
