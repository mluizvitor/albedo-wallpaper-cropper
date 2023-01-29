import { useCanvas } from "./hooks/useCanvas"

import { CropperSection } from "./Sections/CropperSection";
import { CanvasSection } from "./Sections/CanvasSection";
import FileListSection from "./Sections/FileListSection";

function App() {


  return (
    <>

      <main>
        <CanvasSection />
        <CropperSection />
        <FileListSection />
      </main>
    </>
  )
}

export default App
