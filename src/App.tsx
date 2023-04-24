import { CropperSection } from './sections/CropperSection';
import { CanvasSection } from './sections/CanvasSection';
import FileListSection from './sections/FileListSection';
import IDB from './database/config';
import { CircleNotch } from 'phosphor-react';
import { useLoader } from './hooks/useLoader';
import { UpdatePrompt } from './components/UpdatePrompt';
import { PaginationProvider } from './hooks/usePagination';
import { useEffect, useState } from 'react';

const guideNames = ['none', 'albedo', 'elementerial'];
export type GuideProps = typeof guideNames[number];

function App() {
  const { loaderIsOn } = useLoader();

  IDB();

  const [guide, setGuide] = useState<GuideProps>(() => {
    const getValue = localStorage.getItem('guideType');
    if (typeof getValue === 'string' && guideNames.includes(getValue)) {
      return getValue;
    }
    return 'none';
  });

  useEffect(() => {
    localStorage.setItem('guideType', guide);
  }, [guide]);

  function changeGuide(guide: GuideProps) {
    setGuide(guide);
  }

  return (
    <main>
      <CanvasSection guideState={guide} />
      <CropperSection guideMethod={changeGuide}
        guide={guide} />

      <PaginationProvider>
        <FileListSection />
      </PaginationProvider>

      {loaderIsOn && (
        <div className='fixed inset-0 bg-neutral-900/50 flex flex-col items-center justify-center backdrop-blur-lg z-50'>
          <CircleNotch size={96}
            className='animate-spin' />

          <span className='font-teko text-xl'>
            {'Please wait...'}
          </span>
        </div>
      )}
      <UpdatePrompt />
    </main>
  );
}

export default App;
