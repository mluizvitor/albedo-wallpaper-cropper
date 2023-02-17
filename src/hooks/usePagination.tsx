import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { useSystemsCollection } from './useSystemsCollection';


interface PaginationContextData {
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
  pages: number[];
  prevPage: () => void;
  nextPage: () => void;
  goFirst: () => void;
  goLast: (length: number) => void;
  goXPage: (index: number) => void;
  updateImagePerPage: (amount: number) => void;
  updateTotalPages: (amount: number) => void;
}
const PaginationContext = createContext<PaginationContextData>({} as PaginationContextData);

interface PaginationProviderProps {
  children: ReactNode;
}

export function PaginationProvider({ children }: PaginationProviderProps) {

  const { systemCollection } = useSystemsCollection();

  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pages, setPages] = useState<number[]>([]);

  useEffect(() => {
    updateTotalPages(systemCollection.length);
  }, [systemCollection, itemsPerPage]);

  useEffect(() => {
    goFirst();
  }, [itemsPerPage]);

  function prevPage() {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  }

  function nextPage() {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  }

  function goFirst() {
    setCurrentPage(0);
  }

  function goLast() {
    setCurrentPage(totalPages - 1);
  }

  function goXPage(index: number) {
    if (index >= 0 && index <= totalPages - 1) {
      setCurrentPage(index);
    }
  }

  function updateImagePerPage(amount: number) {
    setItemsPerPage(Math.round(amount / 5) * 5);
  }

  function updateTotalPages(amount: number) {
    const totalPagesValue = Math.ceil(amount / itemsPerPage);
    const newPages: number[] = [];
    for (let i = 1; i <= totalPagesValue; i++) {
      newPages.push(i);
    }
    setTotalPages(totalPagesValue);
    setPages(newPages);
  }

  return (
    <PaginationContext.Provider value={{
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
    }}>
      {children}
    </PaginationContext.Provider>
  );
}

export function usePagination() {
  const context = useContext(PaginationContext);

  return context;
}