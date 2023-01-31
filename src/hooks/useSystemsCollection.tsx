import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { CanvasContentProps, useCanvas } from "./useCanvas";
import { selectSystemNameInput } from "../utils/SelectInput";

import JSZip from 'jszip';
import { saveAs } from 'file-saver'
import short from 'short-uuid';

interface SystemProps {
  id: string;
  systemName: string;
  file: CanvasContentProps
}

interface SystemsContentData {
  systemCollection: SystemProps[];
  currentSystemName: string;

  addSystemToCollection: () => void;
  parseSystemName: (name: string) => void;
  removeSystemFromCollection: (systemName: string) => void;
  updateSystemName: (id: string, name: string) => void;
  clearCollection: () => void;
  exportFilesAsZip: () => void;
}

const SystemsContext = createContext<SystemsContentData>({} as SystemsContentData);

interface SystemProviderProps {
  children: ReactNode;
}

export function SystemsProvider({ children }: SystemProviderProps) {
  const storageLabel = "@albedoImageHandler:systemCollection"

  const { canvasContent } = useCanvas()

  const [currentSystemName, setCurrentSystemName] = useState("");
  const [systemCollection, setSystemCollection] = useState<SystemProps[]>(() => {
    const tasks = localStorage.getItem(storageLabel);

    if (tasks) {
      return JSON.parse(tasks);
    }

    return [];
  })

  /**
   * 
   * Add System Name and Image to the System Collection
   * 
   */
  function addSystemToCollection() {
    const currentlyAtCollection = systemCollection.find(item => item.systemName === currentSystemName);
    if (currentlyAtCollection) {
      alert("Already at collection")
      return null;
    }

    if (!currentSystemName) {
      alert("Please insert a system name")
      return null;
    }

    setSystemCollection([...systemCollection, {
      id: short.generate(),
      file: canvasContent,
      systemName: currentSystemName
    }])

    selectSystemNameInput("systemName")
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
    let newCollection = [...systemCollection];
    const systemIndex = newCollection.findIndex((item) => item.id === id);

    newCollection[systemIndex].systemName = name;

    setSystemCollection(newCollection);
  }

  /**
   * 
   * Remove System from Collection
   * @param systemName
   */
  function removeSystemFromCollection(systemName: string) {
    const newCollection = [...systemCollection].filter(item => item.systemName !== systemName);
    setSystemCollection(newCollection);
  }
  /**
   * 
   * Clear collection
   */
  function clearCollection() {
    setSystemCollection([]);
  }

  /**
   * 
   * Download as zip file
   * 
   */

  function exportFilesAsZip() {
    const zip = new JSZip();
    const blurredDir = zip.folder("blurred");

    console.log("WOW")

    systemCollection.map((item) => {

      const normaImage = item.file.normal.replace('data:', '').replace(/^.+,/, '');
      const blurredImage = item.file.blurred.replace('data:', '').replace(/^.+,/, '');

      zip.file(item.systemName + '.webp', normaImage, { base64: true });
      blurredDir?.file(item.systemName + ".blurred.webp", blurredImage, { base64: true })
    })


    zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, "wallpapers.zip");
    })
  }

  useEffect(() => {
    try {
      localStorage.setItem(storageLabel, JSON.stringify(systemCollection));
    } catch (e) {
      console.log(e);
    }
  }, [systemCollection]);

  return (
    <SystemsContext.Provider value={{
      systemCollection,
      currentSystemName,
      addSystemToCollection,
      parseSystemName,
      removeSystemFromCollection,
      updateSystemName,
      clearCollection,
      exportFilesAsZip
    }}>
      {children}
    </SystemsContext.Provider>
  )
}

export function useSystemsCollection() {
  const context = useContext(SystemsContext);

  return context;
}