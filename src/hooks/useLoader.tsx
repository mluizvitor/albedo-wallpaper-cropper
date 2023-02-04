import { ReactNode, createContext, useContext, useState } from 'react';


interface LoaderContextData {
  loaderIsOn: boolean;
  showLoader: () => void;
  hideLoader: () => void;
}
const LoaderContext = createContext<LoaderContextData>({} as LoaderContextData);

interface LoaderProviderProps {
  children: ReactNode;
}

export function LoaderProvider({ children }: LoaderProviderProps) {
  const [loaderIsOn, setLoaderIsOn] = useState(false);

  function showLoader() {
    setLoaderIsOn(true);
  }

  function hideLoader() {
    setLoaderIsOn(false);
  }

  return (
    <LoaderContext.Provider value={{
      loaderIsOn,
      showLoader,
      hideLoader,
    }}>
      {children}
    </LoaderContext.Provider>
  );
}

export function useLoader() {
  const context = useContext(LoaderContext);

  return context;
}