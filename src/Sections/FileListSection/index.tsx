import React, { ChangeEvent } from 'react'
import { useCanvas } from '../../hooks/useCanvas'
import { Plus, Trash, UploadSimple } from 'phosphor-react';
import { SideBar } from '../../components/SideBar';
import { MenuSection } from '../../components/Section';
import Input from '../../components/Input';
import { useSystemsCollection } from '../../hooks/useSystemsCollection';

export default function FileListSection() {

  const { currentSystemImage, updateImage } = useCanvas();
  const { systemCollection, currentSystemName, addSystemToCollection, updateSystemName, removeSystemFromCollection } = useSystemsCollection();

  console.log(systemCollection)

  return (
    <SideBar anchor="right" className='flex flex-col'>
      <MenuSection title={'Wallpaper'} className='grid gap-2'>
        <Input id={'systemName'}
          label={'System Name'}
          type={'text'}
          placeholder="snes"
          value={currentSystemName}
          onChange={(e: ChangeEvent<HTMLInputElement>) => updateSystemName(e.target.value)}
        />
        <label htmlFor="photoWow" className="h-10 flex cursor-pointer shrink-0">
          <div className="bg-slate-700 rounded-l-lg px-3 text-slate-50 flex items-center">
            <UploadSimple size={16} weight="bold" />
          </div>
          <div className="w-full bg-slate-600 font-bold rounded-r-lg px-3 text-slate-50 flex items-center text-sm">
            <span className="whitespace-nowrap overflow-ellipsis overflow-hidden min-w-0">
              {currentSystemImage.name}
            </span>
            <span className="shrink-0">
              {currentSystemImage.extension && `.${currentSystemImage.extension}`}
            </span>
          </div>
        </label>

        <input className="hidden" id="photoWow" type="file" accept=".jpg, .jpeg, .webp, .png" onChange={(e) => updateImage(e)} />

        <button className="flex items-stretch shrink-0 h-10" onClick={addSystemToCollection}>
          <div className="bg-green-700 rounded-l-lg px-3 text-slate-50 flex items-center">
            <Plus size={16} weight="bold" />
          </div>
          <div className="w-full bg-green-600 font-bold rounded-r-lg px-3 text-slate-50 flex items-center text-sm">
            Add
          </div>
        </button>
      </MenuSection>

      <ul className="mt-4 flex flex-col gap-2 h-full overflow-y-scroll p-6 bg-stone-900 border-t border-stone-700">
        {systemCollection.map(collection => (
          <li key={collection.systemName} className="bg-stone-800 p-3 flex flex-col xl:flex-row items-center rounded-xl first:ring-2 first:ring-yellow-500">
            <div className="flex shrink-0 lg:mr-4">
              <img className="h-12 object-cover shrink-0 z-10 rounded-lg mb-4 ring-4 ring-stone-800" src={collection.file.normal} />
              <img className="h-12 object-cover shrink-0 rounded-lg -ml-12 mt-4" src={collection.file.blurred} />
            </div>
            <div className='flex items-center w-full'>
              <span className="mr-4 grow leading-5">
                {collection.systemName}
              </span>
              <button className="p-2 hover:bg-stone-200/20 rounded-xl" onClick={() => removeSystemFromCollection(collection.systemName)}>
                <Trash size={16} weight="bold" />
              </button>
            </div>
          </li>
        )).reverse()}
      </ul>
    </SideBar>

  )
}
