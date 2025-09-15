export type PoopEntry = {
  roomId: string
  characterId: string
  profileId: string
  timestamp?: any
  date: string
  createdAt: string
}

export type Result<T> = { ok: true; value: T } | { ok: false; error: unknown }


