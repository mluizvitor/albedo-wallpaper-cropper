import { ChangeEvent, FormEvent, Fragment, useEffect, useState } from 'react';
import { useCanvas } from '../../hooks/useCanvas';
import { Backspace, CaretDoubleLeft, CaretDoubleRight, CaretLeft, CaretRight, CheckCircle, FileZip, List, Plus, Trash, UploadSimple, X } from 'phosphor-react';
import { SideBar } from '../../components/SideBar';
import { MenuSection } from '../../components/Section';
import { SystemProps, useSystemsCollection } from '../../hooks/useSystemsCollection';
import Button from '../../components/Button';
import { Prompt } from '../../components/Prompt';
import { Combobox } from '@headlessui/react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';


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
  const [systemQuerySearch, setSystemQuerySearch] = useState('');
  const [addedSystemQuery, setAddedSystemQuery] = useState('');

  const imagePerPage = 10;
  const [paginatorStart, setPaginatorStart] = useState(0);
  const [paginatorFinish, setPaginatorFinish] = useState(imagePerPage);

  const filteredSystem = systemQuerySearch === ''
    ? systemList
    : systemList.filter(item => {
      return item.systemName.toLowerCase().includes(systemQuerySearch.toLowerCase());
    });

  const filteredAddedSystem = addedSystemQuery === ''
    ? systemCollection
    : systemCollection.filter(item => {
      return item.systemName.toLowerCase().includes(addedSystemQuery.toLowerCase());
    });

  function toggleDeleteDialog() {
    setIsClearDialogOpen(!isClearDialogOpen);
  };

  function toggleEditDialog() {
    setIsEditDialogOpen(!isEditDialogOpen);
    clearSelection();
  }

  function editCurrentEditData(systemName: string) {
    setCurrentEditData({ ...currentEditData, systemName });
  }

  function clearSelection() {
    setSystemQuerySearch('');
    setSelectedSystem('');
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    addSystemToCollection(selectedSystem);
    clearSelection();
  }


  function handleEditSubmit(event: FormEvent) {
    event.preventDefault();
    updateSystemName(currentEditData.id, currentEditData.systemName);
    toggleEditDialog();
    clearSelection();
  }

  function loadMore() {
    if (paginatorFinish < filteredAddedSystem.length) {
      setPaginatorStart(paginatorStart + imagePerPage);
      setPaginatorFinish(paginatorFinish + imagePerPage);
    }
  }

  function loadLess() {
    if (paginatorStart > 0) {
      setPaginatorStart(paginatorStart - imagePerPage);
      setPaginatorFinish(paginatorFinish - imagePerPage);
    }
  }

  useEffect(() => {
    setPaginatorStart(0);
    setPaginatorFinish(imagePerPage);
  }, [addedSystemQuery]);

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
          className='grid gap-2 grid-cols-1 2xl:grid-cols-2'
          autoComplete='off'>

          <Combobox value={selectedSystem}
            onChange={setSelectedSystem}
            as='div'
            className='block 2xl:col-span-2'>

            <Combobox.Label className={styles.comboboxLabel}>
              {'System Name'}
            </Combobox.Label>

            <div className={styles.comboboxInput}>
              <Combobox.Input onChange={(event) => setSystemQuerySearch(event.target.value)}
                placeholder='Type to add a system'
                className='min-w-0 w-full outline-none border-0 bg-transparent' />

              <Combobox.Options className={styles.comboboxList}>
                {filteredSystem.map((option) => (
                  <Combobox.Option key={option.systemName}
                    value={option.systemName}
                    disabled={option.added}
                    as={Fragment}>
                    {({ active, selected }) => (
                      <li className={[styles.comboboxOption, active && 'bg-stone-700', selected && 'bg-orange-500'].join(' ')}>
                        <span className='w-full rounded py-1'>
                          {option.systemName}
                        </span>

                        {option.added && (
                          <CheckCircle size={16}
                            weight='bold'
                            className='shrink-0' />
                        )}
                      </li>
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

      <div className='bg-neutral-800 px-4 py-4 border-t border-neutral-600'>
        <div className={styles.search}>
          <input className='bg-transparent min-w-0 grow h-full outline-none focus:outline-none'
            placeholder='Type to search added systems'
            value={addedSystemQuery}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setAddedSystemQuery(e.target.value)} />
          <button className='shrink-0 p-2 rounded-lg hover:bg-white/10'
            onClick={() => setAddedSystemQuery('')}>
            <Backspace size={16}
              weight='bold' />
          </button>
        </div>
      </div>

      <div className='h-full bg-neutral-900 overflow-y-auto relative border-t border-b border-neutral-600 p-4'>
        <ul className='grid grid-cols-2 grid-rows-5 w-full h-full gap-2'>
          {filteredAddedSystem.map(item => (
            <li key={item.id}
              className='relative bg-neutral-800 p-2 grid gap-2 grid-rows-[1fr_auto] rounded first-of-type:ring-2 ring-orange-500 group'>

              <div className={styles.imageWrapper}>
                <Zoom zoomMargin={32}>
                  <img className={styles.systemListImg}
                    src={item.file.normal} />
                </Zoom>
                <Zoom zoomMargin={32}>
                  <img className={styles.systemListImg}
                    src={item.file.blurred} />
                </Zoom>
              </div>

              <span className='w-full px-1 text-sm min-w-0 text-center cursor-pointer whitespace-nowrap overflow-ellipsis overflow-hidden'
                title={'Edit ' + item.systemName}
                onClick={() => {
                  toggleEditDialog();
                  setCurrentEditData(item);
                }}>
                {item.systemName}
              </span>

              <button className='absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 rounded group-hover:bg-red-600 transition-all duration-300'
                onClick={() => removeSystemFromCollection(item.id)}>
                <X size={16}
                  weight='bold' />
              </button>
            </li>
          )).reverse().slice(paginatorStart, paginatorFinish)}
        </ul>
      </div >

      <div className='bg-neutral-800 z-[1] px-4 py-2 border-b border-neutral-600 grid grid-cols-1 2xl:grid-cols-[auto_1fr] gap-8 justify-stretch items-center'>
        <span className='text-sm'>{systemCollection.length}{' of '}{systemList.length}{' added'}</span>

        <div className='flex items-stretch'>
          <Button label='First Page'
            hideLabel
            icon={<CaretDoubleLeft size={16}
              className='group-disabled:opacity-30'
              weight='bold' />}
            className='disabled:pointer-events-none px-2 rounded-r-none hover:rounded-r-none group bg-opacity-70'
            disabled={!(paginatorStart > 0)}
            onClick={() => { setPaginatorStart(0); setPaginatorFinish(imagePerPage); }} />

          <Button label='Previous Page'
            hideLabel
            icon={<CaretLeft size={16}
              className='group-disabled:opacity-30'
              weight='bold' />}
            className='disabled:pointer-events-none px-2 rounded-none hover:rounded-none group bg-opacity-70'
            disabled={!(paginatorStart > 0)}
            onClick={() => loadLess()} />

          <div className='px-2 bg-neutral-700 h-auto text-center grow bg-opacity-70'>
            <span className='leading-8 text-sm'>{Math.ceil(paginatorFinish / imagePerPage)}{'/'}{Math.ceil(filteredAddedSystem.length / imagePerPage)}</span>
          </div>

          <Button label='Next Page'
            hideLabel
            icon={<CaretRight size={16}
              className='group-disabled:opacity-30'
              weight='bold' />}
            className='disabled:pointer-events-none px-2 rounded-none hover:rounded-none group bg-opacity-70'
            disabled={!(paginatorFinish < filteredAddedSystem.length)}
            onClick={() => loadMore()} />

          <Button label='Last Page'
            hideLabel
            icon={<CaretDoubleRight size={16}
              className='group-disabled:opacity-30'
              weight='bold' />}
            className='disabled:pointer-events-none px-2 rounded-l-none hover:rounded-l-none group bg-opacity-70'
            disabled={!(paginatorFinish < filteredAddedSystem.length)}
            onClick={() => { setPaginatorStart((Math.ceil(filteredAddedSystem.length / imagePerPage) - 1) * imagePerPage); setPaginatorFinish(Math.ceil(filteredAddedSystem.length / imagePerPage) * imagePerPage); }} />
        </div>
      </div>

      {systemCollection.length !== 0 && (
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
      )}

      < Prompt open={isClearDialogOpen}
        onClose={toggleDeleteDialog}
        promptTitle='Are you sure you want to clear all System Collection?' >
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
      </Prompt >

      <Prompt open={isEditDialogOpen}
        onClose={toggleEditDialog}
        promptTitle='Enter a new name'>

        <form onSubmit={(e) => handleEditSubmit(e)}
          className='grid grid-cols-2 gap-2'
          autoComplete='off'>

          <Combobox value={currentEditData.systemName}
            onChange={editCurrentEditData}
            as='div'
            className='block col-span-2'>

            <div className={styles.comboboxInput}>
              <Combobox.Input onChange={(event) => setSystemQuerySearch(event.target.value)}
                placeholder='Type to add a system'
                autoFocus
                className='min-w-0 w-full outline-none border-0 bg-transparent' />

              <Combobox.Options className={styles.comboboxList}>
                {filteredSystem.map((option) => (
                  <Combobox.Option key={option.systemName}
                    disabled={option.added}
                    value={option.systemName}
                    as={Fragment}>

                    {({ active, selected }) => (
                      <li className={[styles.comboboxOption, active && 'bg-stone-700', selected && 'bg-yellow-600 font-bold'].join(' ')}>
                        <span className='w-full rounded py-1'>
                          {option.systemName}
                        </span>

                        {option.added && (
                          <CheckCircle size={16}
                            weight='bold'
                            className='shrink-0' />
                        )}
                      </li>
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
