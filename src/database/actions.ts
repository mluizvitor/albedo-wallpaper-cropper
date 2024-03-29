import { databaseName } from './config';

let db: IDBDatabase;

export const idbGetElement = <T>(store: string, key: number | 'all') => {
  const open = indexedDB.open(databaseName);
  return new Promise<T>((resolve, reject) => {
    open.onsuccess = () => {
      let request!: IDBRequest;
      db = open.result;

      if ([...db.objectStoreNames].find((name) => name === store)) {
        const transaction = db.transaction(store);
        const objectStore = transaction.objectStore(store);
        
        if (key === 'all') {
          request = objectStore.getAll();
        } else {
          request = objectStore.get(key);
        };
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        transaction.oncomplete = () => db.close();

      } else {
        indexedDB.deleteDatabase(databaseName);
      }
    };
  });
};

export const idbAddElement = (store: string, payload: object) => {
  const open = indexedDB.open(databaseName);
  open.onsuccess = () => {
    db = open.result;

    if ([...db.objectStoreNames].find((name) => name === store)) {
      const transaction = db.transaction(store, 'readwrite');
      const objectStore = transaction.objectStore(store);
      const serialized = JSON.parse(JSON.stringify(payload));
      const request = objectStore.add(serialized);

      request.onerror = () => console.error(request.error);
      transaction.oncomplete = () => db.close();

    } else {
      indexedDB.deleteDatabase(databaseName);
    }
  };
};

export const idbEditElement = <T>(store: string, key: number | 'all', payload: object) => {
  const open = indexedDB.open(databaseName);
  return new Promise<T>((resolve, reject) => {
    open.onsuccess = () => {
      let request: IDBRequest;
      db = open.result;

      if ([...db.objectStoreNames].find((name) => name === store)) {
        const transaction = db.transaction(store, 'readwrite');
        const objectStore = transaction.objectStore(store);
        
        if (key === 'all') {
          request = objectStore.getAll();
        }else {
          request = objectStore.get(key);
        };

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          if (request.result) {
            const serialized = JSON.parse(JSON.stringify(payload));
            const updateRequest = objectStore.put(serialized);
            updateRequest.onsuccess = () => resolve(request.result);
          }
        };
        transaction.oncomplete = () => db.close();

      } else {
        indexedDB.deleteDatabase(databaseName);
      }
    };
  });
};

export const idbRemoveElement = (store: string, key: number | 'all') => {
  const open = indexedDB.open(databaseName);
  open.onsuccess = () => {
    let request: IDBRequest;
    db = open.result;

    if ([...db.objectStoreNames].find((name) => name === store)) {
      const transaction = db.transaction(store, 'readwrite');
      const objectStore = transaction.objectStore(store);
      if (key === 'all') {
        request = objectStore.clear();
      } else {
        request = objectStore.delete(key);
      };
      request.onerror = () => console.error(request.error);
      transaction.oncomplete = () => db.close();
    
    } else {
      indexedDB.deleteDatabase(databaseName);
    }
  };
};