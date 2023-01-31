import React, { ChangeEvent, FormEvent, useState } from "react"
import { useCanvas } from "../../hooks/useCanvas"
import { FileZip, Plus, Trash, UploadSimple, X } from "phosphor-react";
import { SideBar } from "../../components/SideBar";
import { MenuSection } from "../../components/Section";
import Input from "../../components/Input";
import { useSystemsCollection } from "../../hooks/useSystemsCollection";
import Button from "../../components/Button";

export default function FileListSection() {

  const { updateImage } = useCanvas();
  const { systemCollection,
    currentSystemName,
    addSystemToCollection,
    parseSystemName,
    removeSystemFromCollection,
    updateSystemName,
    clearCollection,
    exportFilesAsZip
  } = useSystemsCollection();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    addSystemToCollection();
  }

  function handleClearCollection() {
    window.prompt("Are you sure you want to clear the collection?", "wow")
  }

  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);

  function toggleDeleteDialog() {
    setIsClearDialogOpen(!isClearDialogOpen)
  }

  return (
    <SideBar anchor="left" className="z-10 flex flex-col">

      <MenuSection title={"Wallpaper Options"}>
        <form onSubmit={handleSubmit} className="grid gap-2 grid-cols-1 xl:grid-cols-2">
          <Input id={"systemName"}
            label={"System Name"}
            type={"text"}
            placeholder="snes"
            value={currentSystemName}
            className="xl:col-span-2"
            onChange={(e: ChangeEvent<HTMLInputElement>) => parseSystemName(e.target.value)}
          />
          <input className="hidden" id="fileList_imageSelector" type="file" accept=".jpg, .jpeg, .webp, .png" onChange={(e) => updateImage(e)} />

          <Button label="Load File"
            type="button"
            icon={<UploadSimple size={16} weight="bold" />}
            className="bg-gray-600"
            onClick={() => {
              document.getElementById("fileList_imageSelector")?.click()
            }}
          />
          <Button label={"Add System"} type="submit"
            icon={<Plus size={16} weight="bold" />}
            className="bg-green-600"
          />
        </form>
      </MenuSection>

      <div className="h-full bg-neutral-900 border-t border-b border-neutral-600 py-4 overflow-y-auto">
        <ul className="grid grid-cols-2 w-full gap-2 px-4">
          {systemCollection.map(item => (

            <li key={item.id} className="bg-neutral-800 p-1 pb-2 grid gap-2 rounded-xl first-of-type:ring-2 ring-yellow-500 relative">
              <div className="flex shrink-0 w-full h-14 xl:h-20 relative">
                <img className="object-cover shrink-0 z-10 rounded-lg ring-4 ring-neutral-800 top-0 left-0 absolute w-16 xl:w-24 h-12 xl:h-16" src={item.file.normal} />
                <img className="object-cover shrink-0 rounded-lg bottom-0 right-0 absolute w-16 xl:w-24 h-12 xl:h-16 opacity-70" src={item.file.blurred} />
              </div>

              <input className="bg-transparent w-full min-w-0 text-center"
                value={item.systemName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => updateSystemName(item.id, e.target.value)}
              />

              <button className="absolute rounded-tl-none rounded-br-none top-0 right-0 bg-neutral-800 p-1.5 rounded-xl" onClick={() => removeSystemFromCollection(item.systemName)}>
                <X size={16} weight="bold" />
              </button>
            </li>

          )).reverse()}
        </ul>
      </div>

      {systemCollection.length !== 0 && (
        <>
          <div className="relative shrink-0 w-full p-4 grid gap-2">
            <Button label={"Download Files"}
              icon={<FileZip size={16} weight="bold" />}
              onClick={exportFilesAsZip}
            />
            {isClearDialogOpen && (
              <>
                <div className="fixed inset-0 bg-black/70 z-40" onClick={toggleDeleteDialog} />
                <div className="bg-stone-700 p-4 rounded-xl shadow-xl absolute bottom-12 z-50 inset-x-6 grid gap-2">
                  <strong className="text-lg leading-6">Are you sure you want to clear all System Collection?</strong>
                  <hr className="border-red-500" />

                  <Button label="No, keep them" className="bg-stone-600" onClick={toggleDeleteDialog} />
                  <Button label="Yes, delete all" className="bg-red-500" onClick={clearCollection} />
                </div>
              </>
            )}

            <Button label={"Clear Collection"}
              icon={<Trash size={16} weight="bold" />}
              className="bg-red-600"
              onClick={toggleDeleteDialog}
            />
          </div>
        </>
      )}

    </SideBar>

  )
}
