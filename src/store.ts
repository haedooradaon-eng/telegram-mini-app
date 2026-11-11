import type { ChatMessage, Conversation } from './types'

/**
 * Reading the bot's synced record back into the app.
 * The bot syncs the user's conversations and recent messages to a small
 * store about every minute; reading needs the one-time /link code.
 * No secret is involved here — the code is the only read protection and it
 * comes from the user, never from this code.
 *
 * The store base URL comes from VITE_API_BASE_URL (see .env.example).
 * The placeholder below does nothing — point it at your own sync backend.
 */
export const STORE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'https://api.example.com/api/demo'

export interface StoreFetchResult {
  ok: boolean
  badCode?: boolean
  networkError?: boolean
  data?: unknown
}

export async function fetchStoreState(code: string): Promise<StoreFetchResult> {
  try {
    const res = await fetch(`${STORE_URL}?action=state&code=${encodeURIComponent(code)}`)
    const json: unknown = await res.json().catch(() => null)
    if (!json || (json as { ok?: unknown }).ok === false || res.status >= 400) {
      const error = (json as { error?: string } | null)?.error
      return { ok: false, badCode: error === 'bad_code' }
    }
    return { ok: true, data: json }
  } catch {
    return { ok: false, networkError: true }
  }
}

type UnknownRecord = Record<string, unknown>

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null
}

function pickString(record: UnknownRecord, keys: string[]): string {
  for (const key of keys) {
    const value = record[key]
    if (typeof value === 'string' && value) return value
  }
  return ''
}

function msgWho(message: UnknownRecord): 'user' | 'bot' {
  const role = pickString(message, ['who', 'role', 'from', 'sender']).toLowerCase()
  return role === 'user' || role === 'human' ? 'user' : 'bot'
}

function normMsg(message: unknown): ChatMessage | null {
  if (typeof message === 'string') return { who: 'bot', text: message }
  if (!isRecord(message)) return null
  const text = pickString(message, ['text', 'content', 'body', 'message'])
  return text ? { who: msgWho(message), text } : null
}

export interface MergedStore {
  conversations: Conversation[]
  nextConvId: number
}

/**
 * Merges a synced state into the current conversation list.
 * Tolerates the plausible field spellings of the synced state
 * (name/title, topic/purpose, tone/style, flat message list grouped by
 * conversation name, or per-conversation history).
 * Pure: returns a new list, never mutates its input.
 */
export function mergeStoreState(
  prev: Conversation[],
  nextConvId: number,
  data: unknown,
): MergedStore {
  const root = isRecord(data) ? data : {}
  const state = isRecord(root.state) ? root.state : isRecord(root.data) ? root.data : root
  const syncedConvs = Array.isArray(state.conversations)
    ? state.conversations
    : Array.isArray(state.chats)
      ? state.chats
      : []
  const syncedMsgs = Array.isArray(state.messages)
    ? state.messages
    : Array.isArray(state.history)
      ? state.history
      : []
  let activeName = pickString(state, ['active', 'active_conversation', 'active_title'])
  if (!activeName && isRecord(state.active)) {
    activeName = pickString(state.active, ['title', 'name'])
  }

  let nextId = nextConvId
  const list: Conversation[] = prev.map((c) => ({ ...c, history: [...c.history] }))
  const findByTitle = (title: string) => list.find((c) => c.title === title)
  const add = (title: string): Conversation => {
    const c: Conversation = {
      id: nextId,
      title,
      purpose: '',
      style: '',
      history: [],
      isGeneral: title === 'المحادثة العامة',
      remoteActive: false,
    }
    nextId += 1
    list.push(c)
    return c
  }

  for (const synced of syncedConvs) {
    const title =
      typeof synced === 'string'
        ? synced
        : isRecord(synced)
          ? pickString(synced, ['title', 'name'])
          : ''
    if (!title) continue
    const conv = findByTitle(title) ?? add(title)
    if (isRecord(synced)) {
      const purpose = pickString(synced, ['purpose', 'topic'])
      const style = pickString(synced, ['style', 'tone', 'treatment'])
      if (purpose) conv.purpose = purpose
      if (style) conv.style = style
      const inner = synced.messages ?? synced.history
      if (Array.isArray(inner) && inner.length) {
        conv.history = inner
          .map(normMsg)
          .filter((m): m is ChatMessage => m !== null)
      }
    }
    conv.remoteActive = Boolean(activeName) && title === activeName
  }

  if (syncedMsgs.length) {
    const grouped = new Map<string, ChatMessage[]>()
    for (const message of syncedMsgs) {
      if (!isRecord(message)) continue
      const title = pickString(message, ['conversation', 'conversation_title', 'chat', 'title', 'thread']) || 'المحادثة العامة'
      const normalized = normMsg(message)
      if (!normalized) continue
      const bucket = grouped.get(title) ?? []
      bucket.push(normalized)
      grouped.set(title, bucket)
    }
    for (const [title, messages] of grouped) {
      const conv = findByTitle(title) ?? add(title)
      if (messages.length >= conv.history.length) conv.history = messages
    }
  }

  return { conversations: list, nextConvId: nextId }
}
