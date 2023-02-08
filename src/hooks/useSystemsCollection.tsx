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
  editSystem: (id: number, name: string, replaceImage?: boolean) => void;
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
    console.log(selectedSystem);
    if (!currentLoadedImage) {
      alert('No image loaded');
      return null;
    }

    const currentlyAtCollection = systemCollection.find(item => item.theme === selectedSystem.theme);
    if (currentlyAtCollection) {
      alert('Already at collection');
      return null;
    }

    if (!selectedSystem.theme || selectedSystem.theme.length === 0) {
      alert('Please insert a system name');
      return null;
    }

    const generatedData: SystemProps = {
      ...selectedSystem,
      id: new Date().getTime(),
      file: canvasContent,
      added: true,
    };

    setSystemCollection([...systemCollection, generatedData]);
    idbAddElement('systemCollection', generatedData);
  }

  /**
   * 
   * Edit System Name on Collection
   * @param id 
   * @param name 
   */

  function editSystem(id: number, name: string, replaceImage?: boolean) {
    if (!name || name.length === 0) {
      return;
    }

    const newCollection = [...systemCollection];
    const originalSystemFound = newCollection.find((item) => item.id === id);

    if (originalSystemFound) {
      const newSystemFound: SystemProps = {
        ...originalSystemFound,
        systemName: name,
        file: replaceImage ? canvasContent : originalSystemFound.file,
      };

      newCollection[newCollection.findIndex((item) => item.id === id)] = newSystemFound;

      setSystemCollection(newCollection);
      idbEditElement('systemCollection', id, newSystemFound);
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

          zip.file(item.systemName + '.webp', normalImage, { base64: true });
          blurredDir?.file(item.systemName + '.blurred.webp', blurredImage, { base64: true });
        });
      } else if (systemName) {
        const singleSystem = systemCollection.find(item => item.systemName === systemName);
        if (!singleSystem) {
          throw new Error('Could not find required system');
        }

        normalImage = singleSystem.file.normal.replace('data:', '').replace(/^.+,/, '');
        blurredImage = singleSystem.file.blurred.replace('data:', '').replace(/^.+,/, '');

        zip.file(singleSystem.systemName + '.webp', normalImage, { base64: true });
        blurredDir?.file(singleSystem.systemName + '.blurred.webp', blurredImage, { base64: true });
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
      console.log(newParsedContent);

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
      if (Array.isArray(result) && result.length !== 0 && 'systemName' in result[0]) {
        console.log('loaded as previous data type');
        handleLoadPreviousVersion(result);
      } else {
        console.log('loaded as current data type');
        setSystemCollection(result as SystemProps[]);
      }
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