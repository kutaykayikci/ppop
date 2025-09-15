// Minimal IndexedDB helper (no external deps)

const DB_NAME = 'ppop-db'
const STORE = 'queues'
const VERSION = 1

const openDb = (): Promise<IDBDatabase> => new Promise((resolve, reject) => {
  if (typeof indexedDB === 'undefined') return reject(new Error('IndexedDB not available'))
  const req = indexedDB.open(DB_NAME, VERSION)
  req.onupgradeneeded = () => {
    const db = req.result
    if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE)
  }
  req.onsuccess = () => resolve(req.result)
  req.onerror = () => reject(req.error as any)
})

export const idbGet = async (key: string): Promise<any> => {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const store = tx.objectStore(STORE)
    const req = store.get(key)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error as any)
  })
}

export const idbSet = async (key: string, value: any): Promise<boolean> => {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    const store = tx.objectStore(STORE)
    const req = store.put(value, key)
    req.onsuccess = () => resolve(true)
    req.onerror = () => reject(req.error as any)
  })
}

export const idbDel = async (key: string): Promise<boolean> => {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    const store = tx.objectStore(STORE)
    const req = store.delete(key)
    req.onsuccess = () => resolve(true)
    req.onerror = () => reject(req.error as any)
  })
}


