import { ChangeEvent, FormEvent, Fragment, useEffect, useState } from 'react';
import { useCanvas } from '../../hooks/useCanvas';
import { Backspace, CaretDoubleLeft, CaretDoubleRight, CaretDown, CaretLeft, CaretRight, CaretUp, CheckCircle, DownloadSimple, FloppyDisk, Gear, List, MagnifyingGlass, Plus, Trash, UploadSimple } from 'phosphor-react';
import { SideBar } from '../../components/SideBar';
import { IndexedSystemProps, SystemProps, useSystemsCollection } from '../../hooks/useSystemsCollection';
import Button from '../../components/Button';
import { Prompt } from '../../components/Prompt';
import { Combobox, Popover } from '@headlessui/react';
import 'react-medium-image-zoom/dist/styles.css';


import styles from './styles.module.css';
import { FileCard } from '../../components/FileCard';
import Checkbox from '../../components/Checkbox';
import Input from '../../components/Input';

export default function FileListSection() {

  const { updateImage } = useCanvas();
  const { systemCollection,
    systemList,
    addSystemToCollection,
    removeSystemFromCollection,
    editSystem,
    clearCollection,
    exportFilesAsZip,
    exportProject,
    importProject,
  } = useSystemsCollection();

  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isFileListSettingsDialogOpen, setIsFileListSettingsDialogOpen] = useState(false);
  const [isSaveProjectDialogOpen, setIsSaveProjectDialogOpen] = useState(false);

  const [currentEditData, setCurrentEditData] = useState({} as SystemProps);
  const [selectedSystem, setSelectedSystem] = useState({} as IndexedSystemProps);
  const [systemQuerySearch, setSystemQuerySearch] = useState('');
  const [addedSystemQuery, setAddedSystemQuery] = useState('');

  const [hideBlurredFile, setHideBlurredFile] = useState(false);

  const [imagePerPage, setImagePerPage] = useState(15);
  const [paginatorStart, setPaginatorStart] = useState(0);

  const [downloadFileName, setDownloadFileName] = useState('');


  const filteredSystem = systemQuerySearch === ''
    ? systemList
    : systemList.filter(item => {
      const filteredByName = item.theme.toLowerCase().includes(systemQuerySearch.toLowerCase());
      const filteredByManufacturer = item.manufacturer.toLowerCase().includes(systemQuerySearch.toLowerCase());
      const filteredByFullName = item.fullName.toLowerCase().includes(systemQuerySearch.toLowerCase());
      return filteredByName || filteredByManufacturer || filteredByFullName;
    });

  const filteredAddedSystem = addedSystemQuery === ''
    ? systemCollection
    : systemCollection.filter(item => {
      const filteredByName = item.theme.toLowerCase().includes(addedSystemQuery.toLowerCase());
      const filteredByManufacturer = item.manufacturer.toLowerCase().includes(addedSystemQuery.toLowerCase());
      const filteredByFullName = item.fullName.toLowerCase().includes(addedSystemQuery.toLowerCase());
      return filteredByName || filteredByManufacturer || filteredByFullName;
    });

  function toggleDeleteDialog() {
    setIsClearDialogOpen(!isClearDialogOpen);
  };

  function toggleEditDialog() {
    setIsEditDialogOpen(!isEditDialogOpen);
    clearSelection();
  }

  function toggleProjectDialog() {
    setIsProjectDialogOpen(!isProjectDialogOpen);
  }

  function toggleSaveProjectDialog() {
    setIsSaveProjectDialogOpen(!isSaveProjectDialogOpen);
  }

  function editCurrentEditData(targetSystem: IndexedSystemProps) {
    setCurrentEditData({
      ...currentEditData,
      manufacturer: targetSystem.manufacturer,
      fullName: targetSystem.fullName,
      theme: targetSystem.theme,
    });
  }

  function clearSelection() {
    setSystemQuerySearch('');
    setSelectedSystem({} as IndexedSystemProps);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    addSystemToCollection(selectedSystem);
    clearSelection();
  }

  function handleEditSubmit(event: FormEvent) {
    event.preventDefault();
    editSystem(currentEditData.id, currentEditData);
    toggleEditDialog();
    clearSelection();
  }

  function handleOpenProject() {
    if (systemCollection.length === 0) {
      loadImage();
    } else {
      toggleProjectDialog();
    }
  }

  function handleExportProject() {
    const parsedDate = new Date().toISOString().slice(0, 19).replaceAll('-', '').replaceAll(':', '').replaceAll('T', '');
    setDownloadFileName('AlbedoBackup-' + parsedDate);
    toggleSaveProjectDialog();
  }

  function handleExportProjectSubmit(event: FormEvent) {
    event.preventDefault();
    exportProject(downloadFileName);
    toggleSaveProjectDialog();
  }

  function loadImage() {
    const input = document.createElement('input') as HTMLInputElement;
    input.type = 'file';
    input.accept = '.awc.json';
    input.click();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    input.onchange = (event: any) => {
      importProject(event);
      setIsProjectDialogOpen(false);
    };
  }

  function loadMore() {
    if (paginatorStart + imagePerPage < filteredAddedSystem.length) {
      setPaginatorStart(paginatorStart + imagePerPage);
    }
  }

  function loadLess() {
    if (paginatorStart >= imagePerPage) {
      setPaginatorStart(paginatorStart - imagePerPage);
    } else {
      setPaginatorStart(0);
    }
  }

  useEffect(() => {
    setPaginatorStart(0);
  }, [addedSystemQuery, imagePerPage]);

  useEffect(() => {
    if (filteredAddedSystem.length > 0 && filteredAddedSystem.length <= paginatorStart) {
      setPaginatorStart(paginatorStart - imagePerPage);
    };
  }, [filteredSystem]);

  useEffect(() => {
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      if ((event.key === 'o' || event.key === 'O') && event.ctrlKey) {
        event.preventDefault();

        handleOpenProject();
      }
      if ((event.key === 'i' || event.key === 'I') && event.ctrlKey) {
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
      <div className='relative shrink-0 w-full flex bg-neutral-700 p-4 pb-2'>

        <Popover className='relative'>
          <Popover.Button className='px-2 h-8 flex items-center bg-neutral-600 hover:brightness-125 rounded hover:rounded-lg transition-all duration-300'>
            <List size={16}
              weight='bold' />
            <span className='ml-2 font-bold'>{'Menu'}</span>
          </Popover.Button>

          <Popover.Panel className={styles.popOverPanel}>
            <Button label='Load Project'
              className='font-normal w-full'
              onClick={handleOpenProject}
              icon={<UploadSimple size={16}
                weight='bold' />} />

            <Button label='Save Project'
              className='font-normal w-full'
              onClick={handleExportProject}
              icon={<FloppyDisk size={16}
                weight='bold' />} />

            {systemCollection.length !== 0 && (
              <>
                <hr className='border-neutral-500 my-1' />

                <Button label='Download as ZIP'
                  id='buttonDownloadZip'
                  icon={<DownloadSimple size={16}
                    weight='bold' />}
                  className='font-normal w-full'
                  onClick={() => exportFilesAsZip('all')}
                />

                <Button label='Clear Collection'
                  icon={<Trash size={16}
                    weight='bold' />}
                  className='font-normal p-2 w-full text-red-200 hover:bg-red-400/20'
                  onClick={toggleDeleteDialog}
                />
              </>
            )}
          </Popover.Panel>
        </Popover>
        <Button label='Load Image'
          type='button'
          icon={<UploadSimple size={16}
            weight='bold' />}
          className='bg-neutral-600 ml-auto'
          onClick={() => {
            document.getElementById('fileList_imageSelector')?.click();
          }}
        />
        <input className='hidden'
          id='fileList_imageSelector'
          type='file'
          accept='.jpg, .jpeg, .webp, .png'
          onChange={(e) => {
            updateImage(e);
            e.target.value = '';
          }} />
      </div>

      <form onSubmit={handleSubmit}
        className='flex p-4 pt-2 bg-neutral-700'
        autoComplete='off'>

        <Combobox value={selectedSystem}
          onChange={setSelectedSystem}>
          <div className={styles.comboboxInput}>
            <Combobox.Input onChange={(event) => setSystemQuerySearch(event.target.value.toLowerCase())}
              displayValue={(option: IndexedSystemProps) => option.theme || ''}
              placeholder='Type to add a system'
              className='min-w-0 w-full outline-none border-0 bg-transparent' />

            <Combobox.Options className={styles.comboboxList}>
              {systemQuerySearch.length > 0 && !systemList.find((item) => (item.theme || item.manufacturer) === systemQuerySearch) && (
                <Combobox.Option value={{ theme: systemQuerySearch } as IndexedSystemProps}
                  as={Fragment}>
                  {({ active, selected }) => (
                    <li className={[styles.comboboxOption, active && 'bg-neutral-700', selected && 'bg-orange-500'].join(' ')}>
                      <Plus size={16}
                        weight='bold'
                        className='mr-2' />
                      <span className='w-full rounded py-1'>
                        {systemQuerySearch.toLowerCase()}
                      </span>
                    </li>
                  )}
                </Combobox.Option>
              )}
              {filteredSystem.map((option) => (
                <Combobox.Option key={option.theme}
                  value={option}
                  disabled={option.added}
                  as={Fragment}>
                  {({ active, selected }) => (
                    <li className={[styles.comboboxOption, active && 'bg-neutral-700', selected && 'bg-orange-500'].join(' ')}>
                      <div className='w-full'>
                        <span className='block leading-[100%] mb-1'>
                          {option.theme}
                        </span>
                        <span className='text-xs block font-semibold opacity-60 leading-[100%]'>
                          {option.manufacturer + ' · ' + option.fullName}
                        </span>
                      </div>
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

            <Combobox.Button className={styles.comboboxButton}>
              <CaretUp size={12}
                className='top-1 inset-x-2.5 absolute'
                weight='bold' />

              <CaretDown size={12}
                className='bottom-1 inset-x-2.5 absolute'
                weight='bold' />
            </Combobox.Button>
          </div>
        </Combobox>

        <Button label='Add System'
          type='submit'
          icon={<Plus size={16}
            weight='bold' />}
          className='bg-amber-300 text-black/80 pr-3 ml-4'
        />
      </form>

      <div className='h-full flex flex-col bg-neutral-900 overflow-y-auto relative border-t border-b border-neutral-600 px-4 pt-6 pb-8'>
        <div className={[styles.searchBar, 'group'].join(' ')}>
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

        <ul className={[
          'grid w-full grow gap-2',
          imagePerPage === 10 && 'grid-cols-2 grid-rows-5',
          imagePerPage === 15 && 'grid-cols-3 grid-rows-5',
          imagePerPage === 20 && 'grid-cols-4 grid-rows-5'
        ].join(' ')}>
          {filteredAddedSystem.map((item, idx) => (
            <FileCard key={item.id}
              item={item}
              first={idx === systemCollection.length - 1}
              hideBlurred={hideBlurredFile}
              renameMethod={() => {
                toggleEditDialog();
                setCurrentEditData(item);
              }}
              replaceMethod={() => editSystem(item.id, item, true)}
              exportMethod={() => exportFilesAsZip(item.theme)}
              deleteMethod={() => removeSystemFromCollection(item.id)}
            />
          )).reverse().slice(paginatorStart, paginatorStart + imagePerPage)}
        </ul>
      </div >

      <div className='bg-neutral-800 shrink-0 px-4 py-2 flex flex-col justify-center items-stretch'>
        {(filteredAddedSystem.length > imagePerPage) && (
          <div className='flex items-stretch mb-2'>
            <Button label='First Page'
              hideLabel
              icon={<CaretDoubleLeft size={16}
                weight='bold' />}
              className='disabled:pointer-events-none rounded-r-none hover:rounded-r-none group bg-opacity-70 disabled:text-white/30'
              disabled={!(paginatorStart > 0)}
              onClick={() => setPaginatorStart(0)} />

            <Button label='Previous Page'
              hideLabel
              icon={<CaretLeft size={16}
                weight='bold' />}
              className='disabled:pointer-events-none rounded-none hover:rounded-none group bg-opacity-70 disabled:text-white/30'
              disabled={!(paginatorStart > 0)}
              onClick={() => loadLess()} />

            <div className='px-2 bg-neutral-700 h-auto text-center grow bg-opacity-70'>
              <span className='leading-8 text-sm'>{'Page '}{Math.ceil((paginatorStart + imagePerPage) / imagePerPage)}{' of '}{Math.ceil(filteredAddedSystem.length / imagePerPage)}</span>
            </div>

            <Button label='Next Page'
              hideLabel
              icon={<CaretRight size={16}
                weight='bold' />}
              className='disabled:pointer-events-none rounded-none hover:rounded-none group bg-opacity-70 disabled:text-white/30'
              disabled={!(paginatorStart + imagePerPage < filteredAddedSystem.length)}
              onClick={() => loadMore()} />

            <Button label='Last Page'
              hideLabel
              icon={<CaretDoubleRight size={16}
                weight='bold' />}
              className='disabled:pointer-events-none rounded-l-none hover:rounded-l-none group bg-opacity-70 disabled:text-white/30'
              disabled={!(paginatorStart + imagePerPage < filteredAddedSystem.length)}
              onClick={() => { setPaginatorStart((Math.ceil(filteredAddedSystem.length / imagePerPage) - 1) * imagePerPage); }} />
          </div>
        )}

        <div className='flex items-center opacity-60'>
          <span className='w-full text-sm'>
            {addedSystemQuery.length !== 0 ? `Found ${filteredAddedSystem.length} ${filteredAddedSystem.length === 1 ? 'system' : 'systems'}` : `${systemCollection.length} of ${systemList.length} currently supported`}
          </span>
          <Button label='List settings'
            hideLabel
            className='p-1 h-auto bg-transparent'
            icon={<Gear size={16}
              weight='bold' />}
            onClick={() => setIsFileListSettingsDialogOpen(true)} />
        </div>
      </div>

      {/**
       * 
       * File list settings
       * 
       */}

      <Prompt open={isFileListSettingsDialogOpen}
        onClose={() => setIsFileListSettingsDialogOpen(!isFileListSettingsDialogOpen)}
        promptTitle='List settings'>
        <div>
          <Checkbox id='fileList_hideBlurredFile'
            label='Hide blurred variations'
            checked={hideBlurredFile}
            className='bg-neutral-800 px-2 py-1 mb-2'
            triggerMethod={() => setHideBlurredFile(!hideBlurredFile)} />

          <span className='mb-1 block'>{'Items per page'}</span>
          <div className='flex gap-2 items-center'>
            <Button label='10'
              className={[imagePerPage === 10 ? styles.imgPerPageButtonSelected : styles.imgPerPageButton].join(' ')}
              onClick={() => setImagePerPage(10)}
            />
            <Button label='15'
              className={[imagePerPage === 15 ? styles.imgPerPageButtonSelected : styles.imgPerPageButton].join(' ')}
              onClick={() => setImagePerPage(15)}
            />
            <Button label='20'
              className={[imagePerPage === 20 ? styles.imgPerPageButtonSelected : styles.imgPerPageButton].join(' ')}
              onClick={() => setImagePerPage(20)}
            />
          </div>
        </div>
      </Prompt>

      {/**
       * 
       * Clear added system prompt
       * 
      */}

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
            className='bg-red-500 text-white'
            onClick={() => { clearCollection(); toggleDeleteDialog(); }} />
        </div>
      </Prompt >

      {/**
       * 
       * Rename Prompt
       * 
      */}

      <Prompt open={isEditDialogOpen}
        onClose={toggleEditDialog}
        promptTitle='Enter a new name'>

        <form onSubmit={(e) => handleEditSubmit(e)}
          className='grid grid-cols-2 gap-x-2 gap-y-4'
          autoComplete='off'>

          <Combobox value={currentEditData}
            onChange={editCurrentEditData}
            as='div'
            className='block col-span-2'>

            <div className={[styles.comboboxInput, 'bg-neutral-700'].join(' ')}>
              <Combobox.Input onChange={(event) => setSystemQuerySearch(event.target.value)}
                displayValue={(option: IndexedSystemProps) => option.theme || ''}
                placeholder='Type to add a system'
                autoFocus
                className='min-w-0 w-full outline-none border-0 bg-transparent ' />

              <Combobox.Options className={styles.comboboxList}>
                {systemQuerySearch.length > 0 && !systemList.find((item) => (item.theme || item.manufacturer) === systemQuerySearch) && (
                  <Combobox.Option value={{ theme: systemQuerySearch } as IndexedSystemProps}
                    as={Fragment}>
                    {({ active, selected }) => (
                      <li className={[styles.comboboxOption, active && 'bg-neutral-700', selected && 'bg-orange-500'].join(' ')}>
                        <Plus size={16}
                          weight='bold'
                          className='mr-2' />
                        <span className='w-full rounded py-1'>
                          {systemQuerySearch.toLowerCase()}
                        </span>
                      </li>
                    )}
                  </Combobox.Option>
                )}
                {filteredSystem.map((option) => (
                  <Combobox.Option key={option.theme}
                    value={option}
                    disabled={option.added}
                    as={Fragment}>
                    {({ active, selected }) => (
                      <li className={[styles.comboboxOption, active && 'bg-neutral-700', selected && 'bg-orange-500'].join(' ')}>
                        <div className='w-full'>
                          <span className='block leading-[100%] mb-1'>
                            {option.theme}
                          </span>
                          <span className='text-xs block font-semibold opacity-60 leading-[100%]'>
                            {option.manufacturer + ' · ' + option.fullName}
                          </span>
                        </div>
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

              <Combobox.Button className={styles.comboboxButton}>
                <CaretUp size={12}
                  className='top-1 inset-x-2.5 absolute'
                  weight='bold' />

                <CaretDown size={12}
                  className='bottom-1 inset-x-2.5 absolute'
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

      {/**
       * 
       * Load project prompt
       * 
       */}

      <Prompt open={isProjectDialogOpen}
        onClose={toggleProjectDialog}
        promptTitle='Loading a project will discard current changes. Are you sure you want to load a project?'>
        <div className='grid grid-cols-2 gap-2'>
          <Button label='Cancel'
            className='bg-neutral-600'
            onClick={toggleProjectDialog} />
          <Button label='Load Project'
            className='bg-neutral-600'
            onClick={loadImage} />
        </div>
      </Prompt>

      {/**
       * 
       * Save project prompt
       * 
       */}

      <Prompt open={isSaveProjectDialogOpen}
        onClose={toggleSaveProjectDialog}
        promptTitle='Save project as...'>
        <form onSubmit={(e) => handleExportProjectSubmit(e)}
          className='grid gap-4'>

          <Input id='fileList_fileName'
            label=''
            type='text'
            value={downloadFileName}
            inputClassName='bg-neutral-800'
            onChange={(e: ChangeEvent<HTMLInputElement>) => setDownloadFileName(e.target.value)} />

          <div className='grid grid-cols-2 gap-2'>
            <Button label='Cancel'
              className='bg-neutral-600'
              type='button'
              onClick={toggleSaveProjectDialog} />

            <Button label='Download'
              className='bg-amber-400 text-black/80'
              type='submit' />
          </div>
        </form>
      </Prompt>

    </SideBar >

  );
}
