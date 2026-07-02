import encryptionService from "./encryptionService";

const DB_NAME = "healthcare_offline_db";
const DB_VERSION = 1;

let dbPromise = null;

const getDB = () => {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("patients")) {
        db.createObjectStore("patients", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("appointments")) {
        db.createObjectStore("appointments", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("offlineQueue")) {
        db.createObjectStore("offlineQueue", { keyPath: "id", autoIncrement: true });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });

  return dbPromise;
};

const encryptRecord = (record) => {
  if (!record) return null;
  const { id, ...rest } = record;
  const encryptedPayload = encryptionService.encrypt(rest);
  return { id, payload: encryptedPayload };
};

const decryptRecord = (encryptedRecord) => {
  if (!encryptedRecord) return null;
  const { id, payload } = encryptedRecord;
  const decryptedRest = encryptionService.decrypt(payload);
  return { id, ...decryptedRest };
};

const offlineDB = {
  async put(storeName, record) {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      
      const toStore = storeName === "offlineQueue" ? record : encryptRecord(record);
      const req = store.put(toStore);

      req.onsuccess = () => resolve(record);
      req.onerror = () => reject(req.error);
    });
  },

  async getAll(storeName) {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const req = store.getAll();

      req.onsuccess = () => {
        if (storeName === "offlineQueue") {
          resolve(req.result);
        } else {
          resolve(req.result.map(decryptRecord).filter(Boolean));
        }
      };
      req.onerror = () => reject(req.error);
    });
  },

  async get(storeName, id) {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const req = store.get(id);

      req.onsuccess = () => {
        if (storeName === "offlineQueue") {
          resolve(req.result);
        } else {
          resolve(req.result ? decryptRecord(req.result) : null);
        }
      };
      req.onerror = () => reject(req.error);
    });
  },

  async delete(storeName, id) {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      const req = store.delete(id);

      req.onsuccess = () => resolve(id);
      req.onerror = () => reject(req.error);
    });
  },

  async clear(storeName) {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      const req = store.clear();

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }
};

export default offlineDB;
