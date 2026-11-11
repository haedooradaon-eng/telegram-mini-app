export type ViewId =
  | 'view-main'
  | 'view-chat'
  | 'view-orders'
  | 'view-space'
  | 'view-name'
  | 'view-about'
  | 'view-botpic'
  | 'view-morning'
  | 'view-from'
  | 'view-study'
  | 'view-reminders'
  | 'view-memory'
  | 'view-rules'

export type Avatar =
  | { kind: 'img'; src: string }
  | { kind: 'letter'; letter: string; g: 'g1' | 'g2' | 'g3' }

export interface ChatMessage {
  who: 'user' | 'bot'
  text: string
}

export interface Conversation {
  id: number
  title: string
  purpose: string
  style: string
  history: ChatMessage[]
  isGeneral: boolean
  remoteActive: boolean
}

export interface Reminder {
  text: string
  when: string
}

export interface MemoryItem {
  label: string
  value: string
}

export interface BotCommand {
  cmd: string
  desc: string
}

export type StudyMode = 'explain' | 'summary' | 'quiz'

/**
 * Every payload the app sends to the bot via Telegram WebApp sendData.
 * Shapes are identical to the static page — the bot's watcher
 * dispatches on `type`, so these must not drift.
 */
export type BotPayload =
  | { type: 'set_botpic'; avatar: Avatar }
  | { type: 'set_name'; name: string }
  | { type: 'morning_message'; enabled: boolean }
  | { type: 'message'; text: string; conversation?: string }
  | { type: 'new_conversation'; title: string }
  | { type: 'switch_conversation'; title: string }
  | { type: 'delete_conversation'; title: string }
  | { type: 'add_reminder'; text: string; when: string }
  | { type: 'delete_reminder'; text: string; when: string }
  | { type: 'set_nickname'; nickname: string }
  | { type: 'set_style'; style: string }
  | { type: 'remember'; label: string; value: string }
  | { type: 'forget'; label: string }
  | { type: 'clear_memory' }
