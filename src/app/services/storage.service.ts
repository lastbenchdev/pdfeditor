import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly DB_NAME = 'PdfEditorDB';
  private readonly STORE_NAME = 'pdfStore';
  private readonly VERSION = 1;

  private dbPromise: Promise<IDBDatabase> | null = null;

  constructor() {}

  /**
   * Initialize and get the database connection.
   */
  private async getDb(): Promise<IDBDatabase> {
    if (this.dbPromise) {
      return this.dbPromise;
    }

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.VERSION);

      request.onerror = (event) => {
        console.error('IndexedDB error:', event);
        reject('Failed to open IndexedDB');
      };

      request.onsuccess = (event) => {
        resolve((event.target as IDBOpenDBRequest).result);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          db.createObjectStore(this.STORE_NAME);
        }
      };
    });

    return this.dbPromise;
  }

  /**
   * Save raw PDF bytes to IndexedDB.
   * @param id Unique identifier for the PDF
   * @param rawBytes The raw bytes of the PDF
   */
  async saveWorkingCopy(id: string, rawBytes: Uint8Array): Promise<void> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.STORE_NAME, 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.put(rawBytes, id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject('Failed to save to IndexedDB');
    });
  }

  /**
   * Retrieve raw PDF bytes from IndexedDB.
   * @param id Unique identifier for the PDF
   */
  async getWorkingCopy(id: string): Promise<Uint8Array | null> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.STORE_NAME, 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => {
        if (request.result) {
          resolve(request.result as Uint8Array);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject('Failed to retrieve from IndexedDB');
    });
  }

  /**
   * Clear a specific PDF from storage.
   */
  async clearWorkingCopy(id: string): Promise<void> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.STORE_NAME, 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject('Failed to delete from IndexedDB');
    });
  }

  /**
   * Clear everything in the store.
   */
  async clearAll(): Promise<void> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.STORE_NAME, 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject('Failed to clear IndexedDB');
    });
  }
}
