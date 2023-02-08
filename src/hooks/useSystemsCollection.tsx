import { ChangeEvent, ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { CanvasContentProps, useCanvas } from './useCanvas';

import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { idbAddElement, idbEditElement, idbGetElement, idbRemoveElement } from '../database/actions';
import originalSystemList from '../assets/systemList.json';
import { Sorting } from '../utils/Sorting';
import { useLoader } from './useLoader';

export interface IndexedSystemProps {
  theme: string;
  fullName: string;
  manufacturer: string;
  added: boolean;
}

export interface SystemProps extends IndexedSystemProps {
  id: number;
  file: CanvasContentProps;
}

interface SystemsContextData {
  systemCollection: SystemProps[];
  systemList: IndexedSystemProps[];

  addSystemToCollection: (selectedSystem: IndexedSystemProps) => void;
  removeSystemFromCollection: (id: number) => void;
  editSystem: (idToEdit: number, newSystemProps: IndexedSystemProps, replaceImage?: boolean) => void;
  clearCollection: () => void;
  updateSystemList: () => void;

  exportFilesAsZip: (systemName: string | 'all') => void;
  exportProject: () => void;
  importProject: (event: ChangeEvent<HTMLInputElement>) => void;
}

const SystemsContext = createContext<SystemsContextData>({} as SystemsContextData);

interface SystemProviderProps {
  children: ReactNode;
}

export function SystemsProvider({ children }: SystemProviderProps) {
  const { canvasContent, currentLoadedImage } = useCanvas();
  const { showLoader, hideLoader } = useLoader();
  const [systemList, setSystemList] = useState(() => {
    return originalSystemList.systemList.system.map(item => {
      return {
        theme: item.theme,
        manufacturer: item.manufacturer,
        fullName: item.fullname,
        added: false,
      };
    });
  });
  const [systemCollection, setSystemCollection] = useState<SystemProps[]>([]);

  /**
   * 
   * Add System Name and Image to the System Collection
   * 
   */
  function addSystemToCollection(selectedSystem: IndexedSystemProps) {
    if (!currentLoadedImage) {
      alert('No image loaded');
      return null;
    }

    const currentlyAtCollection = systemCollection.find(item => item.theme === selectedSystem.theme);
    if (currentlyAtCollection) {
      alert('Already at collection');
      return null;
    }

    let generatedData: SystemProps = {} as SystemProps;

    if (
      'theme' in selectedSystem && selectedSystem.theme.length !== 0 &&
      'fullName' in selectedSystem && selectedSystem.fullName.length !== 0 &&
      'manufacturer' in selectedSystem && selectedSystem.manufacturer.length !== 0
    ) {
      generatedData = {
        ...selectedSystem,
        id: new Date().getTime(),
        file: canvasContent,
        added: true,
      };
    } else if ('theme' in selectedSystem && selectedSystem.theme.length !== 0) {
      generatedData = {
        theme: selectedSystem.theme,
        fullName: selectedSystem.theme,
        manufacturer: 'Unknown',
        added: true,
        id: new Date().getTime(),
        file: canvasContent,
      };
    } else {
      alert('Please insert a system name');
      return null;
    }


    setSystemCollection([...systemCollection, generatedData]);
    idbAddElement('systemCollection', generatedData);
  }

  /**
   * 
   * Edit System Name on Collection
   * @param idToEdit
   * @param targetSystem
   * @param replaceImage
   */

  function editSystem(idToEdit: number, targetSystem: IndexedSystemProps, replaceImage?: boolean) {
    if (!idToEdit) {
      return null;
    }

    if (replaceImage && !currentLoadedImage) {
      alert('No image loaded');
      return null;
    }

    const newCollection = [...systemCollection];
    const originalSystemFound = newCollection.find((item) => item.id === idToEdit);

    if (originalSystemFound) {
      const newSystemFound: SystemProps = {
        ...originalSystemFound,
        ...targetSystem,
        file: replaceImage ? canvasContent : originalSystemFound.file,
      };

      newCollection[newCollection.findIndex((item) => item.id === idToEdit)] = newSystemFound;

      setSystemCollection(newCollection);
      idbEditElement('systemCollection', idToEdit, newSystemFound);
    }
  }

  /**
   * 
   * Remove System from Collection
   * @param systemName
   */
  function removeSystemFromCollection(id: number) {
    const newCollection = [...systemCollection].filter(item => item.id !== id);

    setSystemCollection(newCollection);
    idbRemoveElement('systemCollection', id);
  }

  /**
   * 
   * Clear collection
   */
  function clearCollection() {
    setSystemCollection([]);
    idbRemoveElement('systemCollection', 'all');
  }

  /**
   * 
   */

  function updateSystemList() {
    const parsedSystemCollection = systemCollection.map(item => item.theme);

    const newSystemList = [...systemList].map(item => {
      if (parsedSystemCollection.includes(item.theme)) {
        return { ...item, added: true };
      } else {
        return { ...item, added: false };
      }
    }).sort((a, b) => Sorting(a.theme, b.theme)).sort((a, b) => Sorting(a.added, b.added));

    setSystemList(newSystemList);
  }

  /**
  * 
  * Download as zip file
  * 
  */

  function exportFilesAsZip(systemName: string | 'all') {
    const zip = new JSZip();
    const blurredDir = zip.folder('blurred');

    let normalImage = '';
    let blurredImage = '';

    try {
      if (systemCollection.length === 0) {
        throw new Error('Empty collection, nothing to do.');
      }

      if (systemName === 'all') {
        systemCollection.map((item) => {
          normalImage = item.file.normal.replace('data:', '').replace(/^.+,/, '');
          blurredImage = item.file.blurred.replace('data:', '').replace(/^.+,/, '');

          zip.file(item.theme + '.webp', normalImage, { base64: true });
          blurredDir?.file(item.theme + '.blurred.webp', blurredImage, { base64: true });
        });
      } else if (systemName) {
        const singleSystem = systemCollection.find(item => item.theme === systemName);
        if (!singleSystem) {
          throw new Error('Could not find required system');
        }

        normalImage = singleSystem.file.normal.replace('data:', '').replace(/^.+,/, '');
        blurredImage = singleSystem.file.blurred.replace('data:', '').replace(/^.+,/, '');

        zip.file(singleSystem.theme + '.webp', normalImage, { base64: true });
        blurredDir?.file(singleSystem.theme + '.blurred.webp', blurredImage, { base64: true });
      }
    } catch (error) {
      alert('Something went wrong: ' + error);
      console.error(error);
    }

    zip.generateAsync({ type: 'blob' }).then(function (content) {
      saveAs(content, systemName === 'all' ? 'wallpapers.zip' : systemName + '.zip');
    });
  }

  function exportProject() {
    const file = new Blob([JSON.stringify(systemCollection)], { type: 'application/json' });
    const parsedDate = new Date().toISOString().slice(0, 19).replaceAll('-', '').replaceAll(':', '').replaceAll('T', '');

    const newName = prompt('Save as...', `AlbedoBackup.${parsedDate}`);

    if (!newName) {
      return null;
    }

    saveAs(file, newName + '.awc.json');
  }

  function importProject(event: ChangeEvent<HTMLInputElement>) {
    const data = event.target.files;
    if (!data) {
      return null;
    }

    const file = data[0];

    if (!file.type.includes('application/json')) {
      alert('Unsupported file type');
      throw new Error('Unsupported file type');
    }

    const reader = new FileReader();
    reader.readAsText(file);

    reader.onloadstart = () => {
      showLoader();
    };

    reader.onloadend = () => {
      hideLoader();
    };

    reader.onerror = (e) => {
      console.log(e);
      alert('Error loading project file');
      hideLoader();
    };

    reader.onload = (e) => {
      const content = e.target?.result;
      if (!content) {
        hideLoader();
        throw Error();
      }

      handleLoadPreviousVersion(JSON.parse(content.toString()));

    };
  }

  function handleLoadPreviousVersion(result: object) {
    if (!result) {
      return null;
    }

    try {
      idbRemoveElement('systemCollection', 'all');

      const parsedContent = result;
      if (!Array.isArray(parsedContent)) {
        throw new Error('Invalid data format');
      }

      let newParsedContent: SystemProps[] = [];

      for (const item of parsedContent) {
        const systemData = systemList.find(foundSys => foundSys.theme === item.theme || foundSys.theme === item.systemName);

        if ((item.id && item.file && item.theme || item.systemName) && systemData) {
          const newData: SystemProps = { ...systemData, id: item.id, theme: item.theme || item.systemName, file: item.file };
          idbAddElement('systemCollection', newData);
          newParsedContent = [...newParsedContent, newData];
        } else {
          throw new Error('Invalid data format');
        }
      }

      setSystemCollection(newParsedContent);

    } catch (error) {
      alert(error);
      console.error(error);
    }
  }

  useEffect(() => {
    updateSystemList();
  }, [systemCollection]);

  useEffect(() => {
    idbGetElement('systemCollection', 'all').then((result) => {
      console.log('Loading fom local database');
      if (Array.isArray(result) && result.length !== 0 && 'systemName' in result[0]) {
        handleLoadPreviousVersion(result);
      } else {
        setSystemCollection(result as SystemProps[]);
      }
      console.log('Finished loading fom local database');
    });
  }, []);

  return (
    <SystemsContext.Provider value={{
      systemCollection,
      systemList,
      addSystemToCollection,
      removeSystemFromCollection,
      editSystem,
      clearCollection,
      updateSystemList,
      exportFilesAsZip,
      exportProject,
      importProject,
    }}>
      {children}
    </SystemsContext.Provider>
  );
}

export function useSystemsCollection() {
  const context = useContext(SystemsContext);

  return context;
}