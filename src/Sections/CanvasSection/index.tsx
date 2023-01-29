import React from 'react'
import { useCanvas } from '../../hooks/useCanvas'
import { CheckSquare, Square } from 'phosphor-react'
import Checkbox from '../../components/Checkbox'

export function CanvasSection() {

  const { canvasContent, showBlur, toggleImageBlur: toggleImageBlue, currentSystemImage } = useCanvas()

  return (
    <section id="MainCanvas" className={`z-0 px-[18rem] xl:px-[28rem] max-h-[100vh] h-[100vh] relative overflow-hidden gap-8 grid items-center justify-center grid-rows-[auto_1fr_auto]`}>
      <div className={['flex justify-center items-center h-16', !currentSystemImage.name && "opacity-50"].join(" ")}>
        <h1>{currentSystemImage.name || "Albedo Image Handler"}</h1>
      </div>

      <div className="flex h-[calc(100vh_-_9rem_-_(2rem_*_2))] w-[calc(100vw-(24rem+4rem)*2)] items-center justify-center relative">
        <img id="imageNormal" className={`ring-4 bg-yellow-900 ring-yellow-500 rounded-md max-h-full`}
          src={showBlur ? canvasContent.blurred : canvasContent.normal} />
      </div>

      <div className='flex justify-center items-start h-20'>
        <Checkbox id={'canvasShowBlurredVariant'}
          label={'Show blurred variant'}
          bigCheckbox
          checked={showBlur}
          triggerMethod={toggleImageBlue}
          className='px-4 py-3 bg-stone-800'
        />
      </div>
    </section >
  )
}
