import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { CanvasContentProps, useCanvas } from './useCanvas';
import { selectSystemNameInput } from '../utils/SelectInput';

import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import short from 'short-uuid';
import { idbAddElement, idbEditElement, idbGetElement, idbRemoveElement } from '../database/actions';

export interface SystemProps {
  id: string;
  systemName: string;
  file: CanvasContentProps
}

interface SystemsContentData {
  systemCollection: SystemProps[];
  currentSystemName: string;

  addSystemToCollection: () => void;
  parseSystemName: (name: string) => void;
  removeSystemFromCollection: (id: string) => void;
  updateSystemName: (id: string, name: string) => void;
  clearCollection: () => void;
  exportFilesAsZip: () => void;
}

const SystemsContext = createContext<SystemsContentData>({} as SystemsContentData);

interface SystemProviderProps {
  children: ReactNode;
}

export function SystemsProvider({ children }: SystemProviderProps) {
  const { canvasContent } = useCanvas();

  const [currentSystemName, setCurrentSystemName] = useState('');
  const [systemCollection, setSystemCollection] = useState<SystemProps[]>([]);

  /**
   * 
   * Add System Name and Image to the System Collection
   * 
   */
  function addSystemToCollection() {
    const currentlyAtCollection = systemCollection.find(item => item.systemName === currentSystemName);
    if (currentlyAtCollection) {
      alert('Already at collection');
      return null;
    }

    if (!currentSystemName) {
      alert('Please insert a system name');
      return null;
    }

    const generatedInfos: SystemProps = {
      id: short.generate(),
      file: canvasContent,
      systemName: currentSystemName,
    };

    setSystemCollection([...systemCollection, generatedInfos]);

    selectSystemNameInput('systemName');

    idbAddElement('systemCollection', generatedInfos);
  }

  /**
   * 
   * parse System Name to lowercase
   * @param name
   */
  function parseSystemName(name: string) {
    setCurrentSystemName(name.toLowerCase());
  }

  /**
   * 
   * Update System Name on Collection
   * @param id 
   * @param name 
   */

  function updateSystemName(id: string, name: string) {
    const newCollection = [...systemCollection];
    const originalSystemFound = newCollection.find((item) => item.id === id);

    if (originalSystemFound) {
      const newSystemFound: SystemProps = {
        id: originalSystemFound.id,
        file: originalSystemFound.file,
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
  function removeSystemFromCollection(id: string) {
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
    idbGetElement('systemCollection', 'all').then((result) => {
      if (result) {
        setSystemCollection(result as SystemProps[]);
      }
    });
  }, []);

  return (
    <SystemsContext.Provider value={{
      systemCollection,
      currentSystemName,
      addSystemToCollection,
      parseSystemName,
      removeSystemFromCollection,
      updateSystemName,
      clearCollection,
      exportFilesAsZip,
    }}>
      {children}
    </SystemsContext.Provider>
  );
}

export function useSystemsCollection() {
  const context = useContext(SystemsContext);

  return context;
}