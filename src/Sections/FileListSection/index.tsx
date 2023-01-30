import React, { ChangeEvent, FormEvent } from "react"
import { useCanvas } from "../../hooks/useCanvas"
import { Plus, Trash, UploadSimple } from "phosphor-react";
import { SideBar } from "../../components/SideBar";
import { MenuSection } from "../../components/Section";
import Input from "../../components/Input";
import { useSystemsCollection } from "../../hooks/useSystemsCollection";
import Button from "../../components/Button";

export default function FileListSection() {

  const { updateImage } = useCanvas();
  const { systemCollection, currentSystemName, addSystemToCollection, updateSystemName, removeSystemFromCollection } = useSystemsCollection();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    addSystemToCollection();
  }

  return (
    <SideBar anchor="left" className="z-10 flex flex-col">

      <MenuSection title={"Wallpaper Options"}>
        <form onSubmit={handleSubmit} className="grid gap-2">
          <Input id={"systemName"}
            label={"System Name"}
            type={"text"}
            placeholder="snes"
            value={currentSystemName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => updateSystemName(e.target.value)}
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
          <Button label={"Add system"} type="submit"
            icon={<Plus size={16} weight="bold" />}
            className="bg-green-600"
          />
        </form>
      </MenuSection>

      <ul className="flex flex-col gap-2 h-full overflow-y-auto p-4 bg-neutral-900 border-t border-neutral-700">
        {systemCollection.map(collection => (
          <li key={collection.systemName} className="bg-neutral-800 p-3 flex flex-col xl:flex-row items-center rounded-xl first:ring-2 first:ring-yellow-500">
            <div className="flex shrink-0 lg:mr-4 w-16 h-12 relative">
              <img className="object-cover shrink-0 z-10 rounded-lg ring-4 ring-neutral-800 top-0 left-0 absolute w-12 h-10" src={collection.file.normal} />
              <img className="object-cover shrink-0 rounded-lg bottom-0 right-0 absolute w-12 h-10 opacity-70" src={collection.file.blurred} />
            </div>
            <div className="flex items-center w-full">
              <span className="mr-4 grow leading-5">
                {collection.systemName}
              </span>
              <button className="p-2 hover:bg-neutral-200/20 rounded-xl" onClick={() => removeSystemFromCollection(collection.systemName)}>
                <Trash size={16} weight="bold" />
              </button>
            </div>
          </li>
        )).reverse()}
      </ul>
    </SideBar>

  )
}
