import { idbGet, idbSet } from '@/services/idbHelper'

const KEY_PREFIX = 'offline_queue_'

export const createQueue = (name: string) => {
  const key = KEY_PREFIX + name
  const read = async (): Promise<any[]> => {
    try {
      const idb = await idbGet(key)
      if (idb) return idb
    } catch {}
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  }
  const write = async (items: any[]): Promise<void> => {
    try { await idbSet(key, items) } catch {}
    try { localStorage.setItem(key, JSON.stringify(items)) } catch {}
  }

  return {
    async enqueue(item: any) {
      const all = await read()
      all.push({ id: Date.now() + Math.random(), item, ts: Date.now() })
      await write(all)
    },
    async peek() {
      const all = await read()
      return all[0] || null
    },
    async dequeue() {
      const all = await read()
      const first = all.shift()
      await write(all)
      return first || null
    },
    async size() {
      const all = await read()
      return all.length
    },
    async clear() { await write([]) }
  }
}

export const processQueue = async (name: string, handler: (item: any) => Promise<boolean>, maxItems: number = 50) => {
  const q = createQueue(name)
  for (let i = 0; i < maxItems; i++) {
    const head = await q.peek()
    if (!head) break
    try {
      const ok = await handler(head.item)
      if (ok) {
        await q.dequeue()
      } else {
        break
      }
    } catch {
      break
    }
  }
}


