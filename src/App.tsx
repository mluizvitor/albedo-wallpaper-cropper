import { useEffect } from "react";
import { useCanvas } from "./hooks/useCanvas"

import { ArrowsClockwise, ArrowsOutSimple, Plus, Trash, UploadSimple } from 'phosphor-react'

function App() {

  const { systemCollection, currentSystemName, currentSystemImage, canvasWidth, canvasHeight, blurAmount, addSystemToCollection, removeSystemFromCollection, updateSystemName, updateBlur, updateSizes, invertSizes, handleFile, updateImage } = useCanvas();

  return (
    <>
      <h1 className="text-2xl font-bold uppercase mb-0 w-full text-center mt-8">Image Handler</h1>
      <main className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          <section className="max-w-xl bg-stone-50 w-full p-6 rounded-3xl">

            <h2 className="text-xl mb-2">Crop</h2>
            <div className="flex gap-2 items-stretch">
              <div className="bg-slate-200 p-2 pr-6 rounded-xl col-span-2">
                <label htmlFor="imageWidth">Width</label>
                <input className="px-2 py-1 rounded-lg w-full" type="number" placeholder="width" max={1920} min={0} id="imageWidth" value={canvasWidth} required
                  onChange={(e) => updateSizes(Number(e.target.value), -1)} />
              </div>

              <button className="z-[10] p-2 -mx-6 h-10 w-10 my-auto bg-slate-600 text-slate-50 rounded-xl shrink-0 justify-center items-center" onClick={invertSizes}>
                <ArrowsClockwise size={24} weight="bold" />
              </button>

              <div className="bg-slate-200 p-2 pl-6 rounded-xl col-span-2">
                <label htmlFor="imageHeight">Height</label>
                <input className="px-2 py-1 rounded-lg w-full" type="number" placeholder="height" max={1920} min={0} id="imageHeight" value={canvasHeight} required
                  onChange={(e) => updateSizes(-1, Number(e.target.value))} />
              </div>
            </div>

            <h2 className="text-xl mb-2 my-6">Presets</h2>
            <div className="flex gap-2">
              <button className="px-3 h-12 rounded-xl bg-slate-200" onClick={() => { updateSizes(480, 320); handleFile }}>480x320</button>
              <button className="px-3 h-12 rounded-xl bg-slate-200" onClick={() => { updateSizes(640, 480); handleFile }}>640x480</button>
              <button className="px-3 h-12 rounded-xl bg-slate-200" onClick={() => { updateSizes(1920, 1152); handleFile }}>1920x1152</button>
            </div>

            <div className="grid grid-cols-2 mt-4 gap-2">
              <div className="bg-slate-200 p-2 rounded-xl flex flex-col items-start">
                <input id="croppedVariant" type={'checkbox'} />
                <label htmlFor="croppedVariant" className="leading-[100%]">Create .cropped variant</label>
              </div>
              <div className="bg-slate-200 p-2 rounded-xl flex flex-col items-start">
                <label htmlFor="imageBlur">Blur</label>
                <input className="px-2 py-1 rounded-lg w-full" type="number" placeholder="blur" min={0} id="imageBlur" value={blurAmount} required
                  onChange={(e) => updateBlur(Number(e.target.value))} />
              </div>
            </div>
          </section>

          <section className="max-w-xl bg-stone-50 w-full p-6 rounded-3xl">
            <h2 className="text-xl mb-2">Preview</h2>
            <canvas className="ring-4 bg-yellow-900 ring-yellow-500 w-full rounded-md" id="wallpaperCanvas" width={canvasWidth} height={canvasHeight}></canvas>
          </section>
        </div>
      </main>

      <section className="p-6">
        <div className="bg-slate-200 p-2 rounded-xl col-span-2 w-full">
          <label htmlFor="systemName">System Name</label>

          <div className="flex gap-2">
            <input className="px-2 py-1 rounded-lg w-full h-12" type="text" placeholder="snes" max={1920} min={0} id="systemName" value={currentSystemName} required
              onChange={(e) => updateSystemName(e.target.value)} />

            <label htmlFor="photoWow" className="h-12 flex cursor-pointer shrink-0">
              <div className="bg-slate-700 rounded-l-lg px-4 text-slate-50 flex items-center">
                <UploadSimple size={16} weight="bold" />
              </div>
              <div className="max-w-[12rem] bg-slate-600 font-bold rounded-r-lg px-4 text-slate-50 flex items-center text-sm">
                <span className="whitespace-nowrap overflow-ellipsis overflow-hidden min-w-0">
                  {currentSystemImage.name}
                </span>
                <span className="shrink-0">
                  {currentSystemImage.extension && `.${currentSystemImage.extension}`}
                </span>
              </div>
            </label>
            <input className="hidden" id="photoWow" type="file" accept=".jpg, .jpeg, .webp, .png" onChange={(e) => updateImage(e)} />
            <button className="flex items-stretch shrink-0 h-12" onClick={addSystemToCollection}>
              <div className="bg-green-700 rounded-l-lg px-4 text-slate-50 flex items-center">
                <Plus size={16} weight="bold" />
              </div>
              <div className="bg-green-600 font-bold rounded-r-lg px-4 text-slate-50 flex items-center shrink-0 text-sm">
                Add
              </div>
            </button>
          </div>
        </div>

        <ul className="mt-4 grid gap-4 grid-rows-2 grid-flow-col">
          {systemCollection.map(collection => (
            <li key={collection.systemName} className="bg-stone-100 p-3 flex items-center rounded-xl">
              <img className="h-12 object-cover shrink-0 rounded-lg" src={collection.file} />
              <span className="mx-4 grow">
                {collection.systemName}
              </span>
              <button className="p-2 hover:bg-stone-200 rounded-xl" onClick={() => removeSystemFromCollection(collection.systemName)}>
                <Trash size={16} weight="bold" />
              </button>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}

export default App
