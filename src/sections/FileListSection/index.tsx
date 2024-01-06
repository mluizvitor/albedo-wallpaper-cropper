import { ChangeEvent, FormEvent, Fragment, useEffect, useState } from 'react';
import { useCanvas } from '../../hooks/useCanvas';
import { CaretDoubleLeft, CaretDoubleRight, CaretDoubleUp, CaretDown, CaretLeft, CaretRight, CaretUp, CheckCircle, DotsThree, DownloadSimple, FloppyDisk, GearSix, List, MagnifyingGlass, Plus, Question, Trash, UploadSimple, X } from 'phosphor-react';
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
import { usePagination } from '../../hooks/usePagination';
import { useSettings } from '../../hooks/useSettings';

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
  const {
    itemsPerPage,
    currentPage,
    totalPages,
    pages,
    prevPage,
    nextPage,
    goFirst,
    goLast,
    goXPage,
    updateImagePerPage,
    updateTotalPages,
  } = usePagination();
  const { toggleLeftPanel, settings } = useSettings();

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
    setDownloadFileName(settings.projectName.toLowerCase().replaceAll(' ', '-').replaceAll(/[*\\/@:]/g, '') + '-' + parsedDate);
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


  function getSupportedSystems(mode: 'supported' | 'new') {
    let supported = 0;
    systemList.map(listItem => {
      systemCollection.map(colItem => {
        colItem.theme === listItem.theme && supported++;
      });
    });

    if (mode === 'supported') {
      return supported;
    } else {
      return systemCollection.length - supported;
    }
  }

  useEffect(() => {
    goFirst();
    updateTotalPages(filteredAddedSystem.length);
  }, [addedSystemQuery]);

  useEffect(() => {
    if (filteredAddedSystem.length > 0 && filteredAddedSystem.length <= currentPage * itemsPerPage) {
      prevPage();
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
    <>
      <Button label='Hide panel'
        hideLabel
        icon={<CaretDoubleUp size={16}
          className={['transition-transform', settings.hideLeftPanel ? 'rotate-90' : '-rotate-90'].join(' ')} />}
        onClick={toggleLeftPanel}
        className={[styles.hidePanelButton, settings.hideLeftPanel ? '-translate-x-[24rem] 2xl:-translate-x-[28rem]' : ''].join(' ')}
      />

      <SideBar anchor='left'
        className={['z-10 flex flex-col', settings.hideLeftPanel ? '-translate-x-[24rem] 2xl:-translate-x-[28rem]' : ''].join(' ')}>

        <div className='p-4 py-3 bg-neutral-700'>
          <div className='relative shrink-0 w-full flex'>
            <Popover className='relative'>
              <Popover.Button className={styles.popOverButton}
                title='Menu'>
                <List size={16}
                  weight='bold' />
              </Popover.Button>

              <Popover.Panel className={styles.popOverPanel}>
                <Button label='Load Project'
                  className={styles.popOverOption}
                  onClick={handleOpenProject}
                  icon={<UploadSimple size={16}
                    weight='bold' />} />

                <Button label='Save Project'
                  className={styles.popOverOption}
                  onClick={handleExportProject}
                  icon={<FloppyDisk size={16}
                    weight='bold' />} />

                {systemCollection.length !== 0 && (
                  <>
                    <hr className='my-1 -mx-0.5' />

                    <Button label='Download as ZIP'
                      id='buttonDownloadZip'
                      icon={<DownloadSimple size={16}
                        weight='bold' />}
                      className={styles.popOverOption}
                      onClick={() => exportFilesAsZip('all')}
                    />

                    <Button label='Clear Collection'
                      icon={<Trash size={16}
                        weight='bold' />}
                      className={styles.popOverOption + ' text-red-200 hover:bg-red-400/20'}
                      onClick={toggleDeleteDialog}
                    />
                  </>
                )}
              </Popover.Panel>
            </Popover>
            <Button label='Help'
              title='Open basic tutorial on new tab'
              className='ml-2 bg-neutral-600'
              icon={<Question size={16}
                weight='bold' />}
              onClick={() => {
                const helpURL = 'https://github.com/mluizvitor/albedo-wallpaper-cropper/blob/master/README.md';
                const anchor = document.createElement('a') as HTMLAnchorElement;

                anchor.href = helpURL;
                anchor.target = '_blank';
                anchor.click();
              }}
            />
            <Button label='Load Image'
              type='button'
              icon={<UploadSimple size={16}
                weight='bold' />}
              className='bg-blue-300 text-black/80 ml-auto'
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

          <hr className='my-3 -mx-4' />

          <form onSubmit={handleSubmit}
            className='flex'
            autoComplete='off'>

            <Combobox value={selectedSystem}
              onChange={setSelectedSystem}>
              <div className={styles.comboboxInput}>
                <Combobox.Input onChange={(event) => setSystemQuerySearch(event.target.value.toLowerCase())}
                  displayValue={(option: IndexedSystemProps) => option.theme || ''}
                  placeholder='Type to add a system'
                  spellCheck='false'
                  className='min-w-0 w-full outline-none border-0 bg-transparent' />

                <Combobox.Options className={styles.comboboxList}>
                  {systemQuerySearch.length > 0 && !systemList.find((item) => (item.theme || item.manufacturer) === systemQuerySearch) && (
                    <Combobox.Option value={{ theme: systemQuerySearch } as IndexedSystemProps}
                      as={Fragment}>
                      {({ active, selected }) => (
                        <li className={[styles.comboboxOption, active && 'bg-white/20', selected && 'bg-amber-500 text-black/80'].join(' ')}>
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
                        <li className={[styles.comboboxOption, active && 'bg-white/20', selected && 'bg-amber-400 text-black/80'].join(' ')}>
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
              className='bg-amber-400 text-black/80 pr-3 ml-4'
            />
          </form>
        </div>

        <div className='h-full flex flex-col bg-neutral-800 overflow-y-auto relative border-t border-b border-neutral-600 p-4'>
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
                className='shadow-none bg-transparent opacity-60 hover:opacity-100'
                icon={<X size={16}
                  weight='bold' />}
                onClick={() => setAddedSystemQuery('')} />
            )}
          </div>
          <ul className={[
            'grid w-full grow gap-2',
            itemsPerPage === 10 && 'grid-cols-2 grid-rows-5',
            itemsPerPage === 15 && 'grid-cols-3 grid-rows-5',
            itemsPerPage === 20 && 'grid-cols-4 grid-rows-5'
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
            )).reverse().slice(currentPage * itemsPerPage, currentPage * itemsPerPage + itemsPerPage)}
          </ul>
        </div >

        <div className='bg-neutral-800 shrink-0 px-4 py-2 flex flex-col justify-center items-stretch'>
          {(filteredAddedSystem.length > itemsPerPage) && (
            <div className='grid grid-cols-[repeat(11,_1fr)] gap-1 mb-2'>
              <Button label='First Page'
                hideLabel
                icon={<CaretDoubleLeft size={16}
                  weight='bold' />}
                className={styles.paginatorButton}
                disabled={!(currentPage > 0)}
                onClick={goFirst} />

              <Button label='Previous Page'
                hideLabel
                icon={<CaretLeft size={16}
                  weight='bold' />}
                className={styles.paginatorButton}
                disabled={!(currentPage > 0)}
                onClick={prevPage} />

              <span title={`More pages before page ${currentPage - 1}`}
                className={[currentPage >= 3 ? 'opacity-100' : 'opacity-0 pointer-events-none', 'm-auto'].join(' ')}>
                <DotsThree size={16}
                  weight='bold' />
              </span>

              {pages.map((page) => {
                if (currentPage < 3 ? page <= 5 : (page > currentPage - 2) && (page <= currentPage + 3)) {
                  return (
                    <Button key={page}
                      label={page.toString()}
                      title={`Go to page ${page}`}
                      className={[currentPage === (page - 1) ? 'bg-amber-400 text-black/80' : '', 'justify-center'].join(' ')}
                      onClick={() => goXPage(page - 1)} />
                  );
                }
              })}

              <span title={`More pages after page ${currentPage > 2 ? currentPage + 3 : 5}`}
                className={[(currentPage < pages.length - 3) && (totalPages > 5) ? 'opacity-100' : 'opacity-0 pointer-events-none', 'm-auto col-start-9 col-end-10'].join(' ')}>
                <DotsThree size={16}
                  weight='bold' />
              </span>

              <Button label='Next Page'
                hideLabel
                icon={<CaretRight size={16}
                  weight='bold' />}
                className={styles.paginatorButton}
                onClick={nextPage}
                disabled={currentPage === totalPages - 1}
              />

              <Button label='Last Page'
                title={`Go to the last page. Page #${totalPages}`}
                hideLabel
                icon={<CaretDoubleRight size={16}
                  weight='bold' />}
                className={styles.paginatorButton}
                disabled={currentPage === totalPages - 1}
                onClick={goLast}
              />
            </div>
          )}

          <div className='flex items-center gap-4'>
            <span className='shrink-0 text-sm opacity-60'>
              {addedSystemQuery.length !== 0 ? `Found ${filteredAddedSystem.length} ${filteredAddedSystem.length === 1 ? 'system' : 'systems'}` : `${getSupportedSystems('supported')} of ${systemList.length} currently supported`}
            </span>
            <span className='shrink-0 grow text-sm opacity-60'>
              {addedSystemQuery.length === 0 && `${getSupportedSystems('new')} new`}
            </span>
            <Button label='List settings'
              hideLabel
              className='p-1 h-auto bg-transparent shadow-none opacity-60 hover:opacity-100'
              icon={<GearSix size={16}
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
              className='mb-2'
              triggerMethod={() => setHideBlurredFile(!hideBlurredFile)} />

            <hr className='-mx-4 my-4' />

            <span className='mb-1 block'>{'Items per page'}</span>
            <div className='flex gap-2 items-center'>
              <Button label='10'
                className={[itemsPerPage === 10 ? styles.imgPerPageButtonSelected : styles.imgPerPageButton].join(' ')}
                onClick={() => updateImagePerPage(10)}
              />
              <Button label='15'
                className={[itemsPerPage === 15 ? styles.imgPerPageButtonSelected : styles.imgPerPageButton].join(' ')}
                onClick={() => updateImagePerPage(15)}
              />
              <Button label='20'
                className={[itemsPerPage === 20 ? styles.imgPerPageButtonSelected : styles.imgPerPageButton].join(' ')}
                onClick={() => updateImagePerPage(20)}
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
          promptTitle='Enter a new system'>

          <form onSubmit={(e) => handleEditSubmit(e)}
            className='grid grid-cols-2 gap-x-2 gap-y-4'
            autoComplete='off'>

            <Combobox value={currentEditData}
              onChange={editCurrentEditData}
              as='div'
              className='block col-span-2'>

              <div className={styles.comboboxInput}>
                <Combobox.Input onChange={(event) => setSystemQuerySearch(event.target.value)}
                  displayValue={(option: IndexedSystemProps) => option.theme || ''}
                  placeholder='Type to add a system'
                  autoFocus
                  spellCheck='false'
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
    </>
  );
}
