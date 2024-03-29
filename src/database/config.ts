export const databaseName = 'AlbedoWppCreator';

export default function () {
  let db!: IDBDatabase;
  const request = indexedDB.open(databaseName, 4);
  request.onerror = (err) => {
    console.error(`IndexedDB error: ${request.error}`, err);
  };

  request.onsuccess = () => {
    (db = request.result);
  };

  request.onupgradeneeded = () => {
    const db = request.result;
    const systemCollection = db.createObjectStore('systemCollection', { keyPath: 'id' });
    systemCollection.createIndex('id', 'id', { unique: true });
    const albedoSettings = db.createObjectStore('albedoSettings', { keyPath: 'id' });
    albedoSettings.createIndex('id', 'id', { unique: true });
  };
  return db;
}