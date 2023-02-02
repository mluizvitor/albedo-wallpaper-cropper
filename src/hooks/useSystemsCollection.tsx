import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { CanvasContentProps, useCanvas } from './useCanvas';

import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { idbAddElement, idbEditElement, idbGetElement, idbRemoveElement } from '../database/actions';
import originalSystemList from '../assets/systemList.json';
import { Sorting } from '../utils/Sorting';

export interface SystemProps {
  id: number;
  systemName: string;
  file: CanvasContentProps;
}

interface SystemsContentData {
  systemCollection: SystemProps[];
  systemList: { systemName: string, added: boolean }[];

  addSystemToCollection: (systemName: string) => void;
  removeSystemFromCollection: (id: number) => void;
  EditSystemName: (id: number, name: string) => void;
  clearCollection: () => void;
  exportFilesAsZip: () => void;
  updateSystenList: () => void;
}

const SystemsContext = createContext<SystemsContentData>({} as SystemsContentData);

interface SystemProviderProps {
  children: ReactNode;
}

export function SystemsProvider({ children }: SystemProviderProps) {
  const { canvasContent } = useCanvas();
  const [systemList, setSystemList] = useState(() => {
    return originalSystemList.map(item => {
      return {
        systemName: item,
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
  function addSystemToCollection(systemName: string) {
    const currentlyAtCollection = systemCollection.find(item => item.systemName === systemName);
    if (currentlyAtCollection) {
      alert('Already at collection');
      return null;
    }

    if (!systemName || systemName.length === 0) {
      alert('Please insert a system name');
      return null;
    }

    const generatedData: SystemProps = {
      id: new Date().getTime(),
      file: canvasContent,
      systemName,
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

  function EditSystemName(id: number, name: string) {
    if (!name || name.length === 0) {
      return;
    }

    const newCollection = [...systemCollection];
    const originalSystemFound = newCollection.find((item) => item.id === id);

    if (originalSystemFound) {
      const newSystemFound: SystemProps = {
        ...originalSystemFound,
        systemName: name,
      };

      newCollection[newCollection.findIndex((item) => item.id === id)].systemName = name;

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

  function updateSystenList() {
    const parsedSystemCollection = systemCollection.map(item => item.systemName);

    const newSystemList = [...systemList].map(item => {
      if (parsedSystemCollection.includes(item.systemName)) {
        return { ...item, added: true };
      } else {
        return { ...item, added: false };
      }
    }).sort((a, b) => Sorting(a.systemName, b.systemName)).sort((a, b) => Sorting(a.added, b.added));

    setSystemList(newSystemList);
  }

  /**
 * 
 * Download as zip file
 * 
 */

  function exportFilesAsZip() {
    const zip = new JSZip();
    const blurredDir = zip.folder('blurred');


    systemCollection.map((item) => {
      const normaImage = item.file.normal.replace('data:', '').replace(/^.+,/, '');
      const blurredImage = item.file.blurred.replace('data:', '').replace(/^.+,/, '');

      zip.file(item.systemName + '.webp', normaImage, { base64: true });
      blurredDir?.file(item.systemName + '.blurred.webp', blurredImage, { base64: true });
    });


    zip.generateAsync({ type: 'blob' }).then(function (content) {
      saveAs(content, 'wallpapers.zip');
    });
  }

  useEffect(() => {
    updateSystenList();
  }, [systemCollection]);

  useEffect(() => {
    idbGetElement('systemCollection', 'all').then((result) => {
      if (result) {
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
      EditSystemName,
      clearCollection,
      exportFilesAsZip,
      updateSystenList,
    }}>
      {children}
    </SystemsContext.Provider>
  );
}

export function useSystemsCollection() {
  const context = useContext(SystemsContext);

  return context;
}