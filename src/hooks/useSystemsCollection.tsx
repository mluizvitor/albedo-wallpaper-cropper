import { ReactNode, createContext, useContext, useState } from "react";
import { CanvasContentProps, useCanvas } from "./useCanvas";
import { selectSystemNameInput } from "../utils/SelectInput";

interface SystemProps {
  systemName: string;
  file: CanvasContentProps
}

interface SystemsContentData {
  systemCollection: SystemProps[];
  currentSystemName: string;

  addSystemToCollection: () => void;
  updateSystemName: (name: string) => void;
  removeSystemFromCollection: (systemName: string) => void;
}

const SystemsContext = createContext<SystemsContentData>({} as SystemsContentData);

interface SystemProviderProps {
  children: ReactNode;
}

export function SystemsProvider({ children }: SystemProviderProps) {

  const { canvasContent } = useCanvas()

  const [currentSystemName, setCurrentSystemName] = useState("snes");
  const [systemCollection, setSystemCollection] = useState<SystemProps[]>([]);

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
      file: canvasContent,
      systemName: currentSystemName
    }])

    selectSystemNameInput("systemName")
  }

  /**
   * 
   * Update System Name
   * 
   */
  function updateSystemName(name: string) {
    setCurrentSystemName(name.toLowerCase());
  }

  /**
   * 
   * Remove System from Collection
   * 
   */
  function removeSystemFromCollection(systemName: string) {
    const newCollection = [...systemCollection].filter(item => item.systemName !== systemName);

    setSystemCollection(newCollection);
  }

  return (
    <SystemsContext.Provider value={{
      systemCollection,
      currentSystemName,
      addSystemToCollection,
      updateSystemName,
      removeSystemFromCollection
    }}>
      {children}
    </SystemsContext.Provider>
  )
}

export function useSystemsCollection() {
  const context = useContext(SystemsContext);

  return context;
}