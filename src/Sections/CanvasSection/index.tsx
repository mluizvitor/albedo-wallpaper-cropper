import React from 'react'
import { useCanvas } from '../../hooks/useCanvas'

export function CanvasSection() {

  const { canvasContent } = useCanvas()

  return (
    <section id="MainCanvas" className={`py-12 px-[18rem] xl:px-[28rem] h-[100vh] overflow-hidden gap-12 flex items-center justify-center flex-col`}>
      <img id="imageNormal" className={`ring-4 bg-yellow-900 ring-yellow-500 shrink rounded-md max-h-[20rem]`} src={canvasContent.normal} />
      <img id="imageBlurred" className={`ring-4 bg-yellow-900 ring-yellow-500 rounded-md max-h-[20rem]`} src={canvasContent.blurred} />
    </section >
  )
}
