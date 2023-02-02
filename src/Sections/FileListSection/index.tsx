import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useCanvas } from '../../hooks/useCanvas';
import { CheckCircle, FileZip, List, Plus, Trash, UploadSimple, X } from 'phosphor-react';
import { SideBar } from '../../components/SideBar';
import { MenuSection } from '../../components/Section';
import Input from '../../components/Input';
import { SystemProps, useSystemsCollection } from '../../hooks/useSystemsCollection';
import Button from '../../components/Button';
import { Prompt } from '../../components/Prompt';
import { Combobox } from '@headlessui/react';

import styles from './styles.module.css';

export default function FileListSection() {

  const { updateImage } = useCanvas();
  const { systemCollection,
    systemList,
    addSystemToCollection,
    removeSystemFromCollection,
    EditSystemName: updateSystemName,
    clearCollection,
    exportFilesAsZip,
  } = useSystemsCollection();

  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [currentEditData, setCurrentEditData] = useState({} as SystemProps);

  const [selectedSystem, setSelectedSystem] = useState('');
  const [querySearch, setQuerySearch] = useState('');

  const filteredSystem = querySearch === ''
    ? systemList
    : systemList.filter(item => {
      return item.systemName.toLowerCase().includes(querySearch.toLowerCase());
    });

  function toggleDeleteDialog() {
    setIsClearDialogOpen(!isClearDialogOpen);
  }

  function toggleEditDialog() {
    setIsEditDialogOpen(!isEditDialogOpen);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    addSystemToCollection(selectedSystem);
    setQuerySearch('');
    setSelectedSystem('');
  }

  function handleEditSubmit(event: FormEvent) {
    event.preventDefault();
    updateSystemName(currentEditData.id, currentEditData.systemName);
    toggleEditDialog();
  }

  useEffect(() => {
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      if ((event.key === 'o' || event.key === 'O') && event.ctrlKey) {
        event.preventDefault();

        document.getElementById('fileList_imageSelector')?.click();
      }
      if ((event.key === 's' || event.key === 'S') && event.ctrlKey) {
        event.preventDefault();

        document.getElementById('buttonDownloadZip')?.click();
      }
    });
  }, []);

  return (
    <SideBar anchor='left'
      className='z-10 flex flex-col'>

      <MenuSection title='Wallpaper Options'>
        <form onSubmit={handleSubmit}
          className='grid gap-2 grid-cols-1 2xl:grid-cols-2'>

          <Combobox value={selectedSystem}
            onChange={setSelectedSystem}
            as='div'
            className='block'>

            <Combobox.Label className={styles.comboboxLabel}>
              {'System Name'}
            </Combobox.Label>

            <div className={styles.comboboxInput}>
              <Combobox.Input onChange={(event) => setQuerySearch(event.target.value)}
                placeholder='Type to search'
                className='min-w-0 w-full outline-none border-0 bg-transparent' />

              <Combobox.Options className={styles.comboboxList}>
                {filteredSystem.map((option) => (
                  <Combobox.Option key={option.systemName}
                    disabled={option.added}
                    className={[styles.comboboxOption, option.added && 'opacity-70 pointer-events-none'].join(' ')}
                    value={option.systemName}>
                    <span>
                      {option.systemName}
                    </span>

                    {option.added && (
                      <CheckCircle size={16}
                        weight='bold' />
                    )}

                  </Combobox.Option>
                ))}
              </Combobox.Options>

              <Combobox.Button className='ml-3 mr-1'>
                <List size={16}
                  weight='bold' />
              </Combobox.Button>
            </div>
          </Combobox>
          <input className='hidden'
            id='fileList_imageSelector'
            type='file'
            accept='.jpg, .jpeg, .webp, .png'
            onChange={(e) => updateImage(e)} />

          <Button label='Load File'
            type='button'
            icon={<UploadSimple size={16}
              weight='bold' />}
            className='bg-gray-600'
            onClick={() => {
              document.getElementById('fileList_imageSelector')?.click();
            }}
          />
          <Button label='Add System'
            type='submit'
            icon={<Plus size={16}
              weight='bold' />}
            className='bg-green-600'
          />
        </form>
      </MenuSection>

      <div className='h-full bg-neutral-900 border-t border-b border-neutral-600 py-4 overflow-y-auto'>
        <ul className='grid grid-cols-2 w-full gap-2 px-4'>
          {systemCollection.map(item => (
            <li key={item.id}
              className='relative bg-neutral-800 p-1 pb-2 grid gap-2 rounded-xl first-of-type:ring-2 ring-yellow-500'>

              <div className='flex shrink-0 w-full h-14 2xl:h-20 relative'>
                <img className='object-cover shrink-0 bottom-0 right-0 absolute rounded-lg w-16 2xl:w-24 h-12 2xl:h-16 opacity-70'
                  src={item.file.blurred} />
                <img className='object-cover shrink-0 top-0 left-0 absolute rounded-lg ring-4 ring-neutral-800 w-16 2xl:w-24 h-12 2xl:h-16'
                  src={item.file.normal} />
              </div>

              <span className='w-full px-1 text-sm min-w-0 text-center cursor-pointer whitespace-nowrap overflow-ellipsis overflow-hidden'
                onClick={() => {
                  toggleEditDialog();
                  setCurrentEditData(item);
                }}>
                {item.systemName}
              </span>

              <button className='absolute rounded-tl-none rounded-br-none top-0 right-0 bg-neutral-800 p-1.5 rounded-xl'
                onClick={() => removeSystemFromCollection(item.id)}>
                <X size={16}
                  weight='bold' />
              </button>
            </li>
          )).reverse()}
        </ul>
      </div>

      {
        systemCollection.length !== 0 && (
          <>
            <div className='relative shrink-0 w-full p-4 grid gap-2'>
              <Button label='Download Files'
                id='buttonDownloadZip'
                icon={<FileZip size={16}
                  weight='bold' />}
                onClick={exportFilesAsZip}
              />

              <Button label='Clear Collection'
                icon={<Trash size={16}
                  weight='bold' />}
                className='bg-red-600'
                onClick={toggleDeleteDialog}
              />
            </div>
          </>
        )
      }

      <Prompt open={isClearDialogOpen}
        onClose={toggleDeleteDialog}
        promptTitle='Are you sure you want to clear all System Collection?'>
        <div
          className='grid grid-cols-2 gap-2'>
          <Button label='Nope, keep them'
            type='button'
            className='bg-stone-600'
            onClick={toggleDeleteDialog} />

          <Button label='Yea, clear all'
            type='submit'
            className='bg-red-600'
            onClick={() => { clearCollection(); toggleDeleteDialog(); }} />
        </div>
      </Prompt>

      <Prompt open={isEditDialogOpen}
        onClose={toggleEditDialog}
        promptTitle='Enter a new name'>

        <form onSubmit={(e) => handleEditSubmit(e)}
          className='grid grid-cols-2 gap-2'
          autoComplete='false'>
          <Input id='editSystemName'
            label=''
            type='text'
            required
            autoFocus
            value={currentEditData.systemName}
            className='col-span-2'
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setCurrentEditData({ ...currentEditData, systemName: e.target.value });
            }} />

          <Button label='Cancel'
            type='button'
            className='bg-stone-600'
            onClick={toggleEditDialog} />

          <Button label='Rename'
            type='submit'
            className='bg-stone-600' />
        </form>
      </Prompt>

    </SideBar >

  );
}
