import { ChangeEvent, FormEvent, Fragment, useEffect, useState } from 'react';
import { useCanvas } from '../../hooks/useCanvas';
import { Backspace, CaretDoubleLeft, CaretDoubleRight, CaretLeft, CaretRight, CheckCircle, DownloadSimple, FileZip, List, MagnifyingGlass, Plus, Trash, UploadSimple, X } from 'phosphor-react';
import { SideBar } from '../../components/SideBar';
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
      <div className='relative shrink-0 w-full flex bg-neutral-600 p-4 pb-2'>
        <Button label='Load Image'
          type='button'
          icon={<UploadSimple size={16}
            weight='bold' />}
          className='bg-transparent hover:bg-white/20 text-neutral-50'
          onClick={() => {
            document.getElementById('fileList_imageSelector')?.click();
          }}
        />

        <input className='hidden'
          id='fileList_imageSelector'
          type='file'
          accept='.jpg, .jpeg, .webp, .png'
          onChange={(e) => updateImage(e)} />

        {systemCollection.length !== 0 && (
          <>
            <Button label='Export'
              id='buttonDownloadZip'
              className='mx-2 bg-transparent hover:bg-white/20 text-neutral-50'
              icon={<DownloadSimple size={16}
                weight='bold' />}
              onClick={exportFilesAsZip}
            />

            <Button label='Clear Collection'
              hideLabel
              icon={<Trash size={16}
                weight='bold' />}
              className='bg-red-600 ml-auto p-2'
              onClick={toggleDeleteDialog}
            />
          </>
        )}
      </div>

      <form onSubmit={handleSubmit}
        className='grid gap-2 p-4 pt-2 bg-neutral-600'
        autoComplete='off'>

        <Combobox value={selectedSystem}
          onChange={setSelectedSystem}>

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
                    <li className={[styles.comboboxOption, active && 'bg-neutral-700', selected && 'bg-orange-500'].join(' ')}>
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

        <Button label='Add System'
          type='submit'
          icon={<Plus size={16}
            weight='bold' />}
          className='bg-yellow-300 text-black/80'
        />
      </form>

      <div className='h-full flex flex-col bg-neutral-900 overflow-y-auto relative border-t border-b border-neutral-600 p-4'>
        <div className={[styles.search, 'group'].join(' ')}>
          <MagnifyingGlass size={16}
            weight='bold'
            className='shrink-0 mr-2 opacity-50 group-focus-within:opacity-100' />
          <input className='bg-transparent min-w-0 grow h-full outline-none focus:outline-none'
            placeholder='Type to search added systems'
            value={addedSystemQuery}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setAddedSystemQuery(e.target.value)} />

          {addedSystemQuery.length !== 0 && (
            <Button label='Clear search'
              hideLabel
              icon={
                <Backspace size={16}
                  weight='bold' />
              }
              onClick={() => setAddedSystemQuery('')} />
          )}
        </div>

        <ul className='grid grid-cols-2 grid-rows-5 grow w-full gap-2'>
          {filteredAddedSystem.map(item => (
            <li key={item.id}
              className='relative bg-neutral-800 p-2 flex flex-col rounded first-of-type:ring-2 ring-orange-500 group'>

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

              <span className='w-full mt-2 shrink-0 px-1 text-xs 2xl:text-sm min-w-0 text-center cursor-pointer whitespace-nowrap overflow-ellipsis overflow-hidden'
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

      <div className='bg-neutral-800 px-4 py-2 flex flex-col justify-center items-stretch'>
        <div className='flex items-stretch'>
          <Button label='First Page'
            hideLabel
            icon={<CaretDoubleLeft size={16}
              className='group-disabled:opacity-30'
              weight='bold' />}
            className='disabled:pointer-events-none rounded-r-none hover:rounded-r-none group bg-opacity-70'
            disabled={!(paginatorStart > 0)}
            onClick={() => { setPaginatorStart(0); setPaginatorFinish(imagePerPage); }} />

          <Button label='Previous Page'
            hideLabel
            icon={<CaretLeft size={16}
              className='group-disabled:opacity-30'
              weight='bold' />}
            className='disabled:pointer-events-none rounded-none hover:rounded-none group bg-opacity-70'
            disabled={!(paginatorStart > 0)}
            onClick={() => loadLess()} />

          <div className='px-2 bg-neutral-700 h-auto text-center grow bg-opacity-70'>
            <span className='leading-8 text-sm'>{'Page '}{Math.ceil(paginatorFinish / imagePerPage)}{' of '}{Math.ceil(filteredAddedSystem.length / imagePerPage)}</span>
          </div>

          <Button label='Next Page'
            hideLabel
            icon={<CaretRight size={16}
              className='group-disabled:opacity-30'
              weight='bold' />}
            className='disabled:pointer-events-none rounded-none hover:rounded-none group bg-opacity-70'
            disabled={!(paginatorFinish < filteredAddedSystem.length)}
            onClick={() => loadMore()} />

          <Button label='Last Page'
            hideLabel
            icon={<CaretDoubleRight size={16}
              className='group-disabled:opacity-30'
              weight='bold' />}
            className='disabled:pointer-events-none rounded-l-none hover:rounded-l-none group bg-opacity-70'
            disabled={!(paginatorFinish < filteredAddedSystem.length)}
            onClick={() => { setPaginatorStart((Math.ceil(filteredAddedSystem.length / imagePerPage) - 1) * imagePerPage); setPaginatorFinish(Math.ceil(filteredAddedSystem.length / imagePerPage) * imagePerPage); }} />
        </div>
        <span className='w-full text-xs text-center mt-1 opacity-60'>
          {`${systemCollection.length} of ${systemList.length} added`}
        </span>
      </div>

      <Prompt open={isClearDialogOpen}
        onClose={toggleDeleteDialog}
        promptTitle='Are you sure you want to clear all System Collection?' >
        <div
          className='grid grid-cols-2 gap-2'>
          <Button label='Nope, keep them'
            type='button'
            className='bg-neutral-600'
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

            <div className={[styles.comboboxInput, 'bg-neutral-800'].join(' ')}>
              <Combobox.Input onChange={(event) => setSystemQuerySearch(event.target.value)}
                placeholder='Type to add a system'
                autoFocus
                className='min-w-0 w-full outline-none border-0 bg-transparent ' />

              <Combobox.Options className={styles.comboboxList}>
                {filteredSystem.map((option) => (
                  <Combobox.Option key={option.systemName}
                    disabled={option.added}
                    value={option.systemName}
                    as={Fragment}>

                    {({ active, selected }) => (
                      <li className={[styles.comboboxOption, active && 'bg-neutral-700', selected && 'bg-yellow-600 font-bold'].join(' ')}>
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
            className='bg-neutral-600'
            onClick={toggleEditDialog} />

          <Button label='Rename'
            type='submit'
            className='bg-neutral-600' />
        </form>
      </Prompt>

    </SideBar >

  );
}
