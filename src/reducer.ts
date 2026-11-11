import { ABOUT_DEFAULT, BOT_AVATAR_SRC, BOT_NAME_DEFAULT } from './data'
import type {
  Avatar,
  ChatMessage,
  Conversation,
  MemoryItem,
  Reminder,
  StudyMode,
  ViewId,
} from './types'

export interface AppState {
  view: ViewId
  drawerOpen: boolean
  name: string
  about: string
  avatar: Avatar
  morning: boolean
  nickname: string
  style: string
  memory: MemoryItem[]
  reminders: Reminder[]
  studyMode: StudyMode
  remWhen: string
  conversations: Conversation[]
  activeConvId: number | null
  nextConvId: number
}

export function createInitialState(): AppState {
  const general: Conversation = {
    id: 1,
    title: 'المحادثة العامة',
    purpose: '',
    style: '',
    history: [],
    isGeneral: true,
    remoteActive: false,
  }
  return {
    view: 'view-main',
    drawerOpen: false,
    name: BOT_NAME_DEFAULT,
    about: ABOUT_DEFAULT,
    avatar: { kind: 'img', src: BOT_AVATAR_SRC },
    morning: true,
    nickname: 'صديقي',
    style: 'الفصحى',
    memory: [
      { label: 'الاسم', value: 'مستخدم تجريبي' },
      { label: 'لغة الردود', value: 'الفصحى' },
    ],
    reminders: [],
    studyMode: 'explain',
    remWhen: 'بعد ساعة',
    conversations: [general],
    activeConvId: 1,
    nextConvId: 2,
  }
}

export type AppAction =
  | { type: 'go'; view: ViewId }
  | { type: 'setDrawer'; open: boolean }
  | { type: 'setAvatar'; avatar: Avatar }
  | { type: 'setName'; name: string }
  | { type: 'toggleMorning' }
  | { type: 'setNickname'; nickname: string }
  | { type: 'setStyle'; style: string }
  | { type: 'addMemory'; item: MemoryItem }
  | { type: 'deleteMemory'; index: number }
  | { type: 'clearMemory' }
  | { type: 'addReminder'; reminder: Reminder }
  | { type: 'deleteReminder'; index: number }
  | { type: 'setStudyMode'; mode: StudyMode }
  | { type: 'setRemWhen'; when: string }
  | { type: 'addConversation'; id: number; title: string }
  | { type: 'deleteConversation'; id: number }
  | { type: 'openConversation'; id: number }
  | { type: 'setActiveConv'; id: number | null }
  | { type: 'addChatMessage'; text: string }
  | { type: 'applyStore'; conversations: Conversation[]; nextConvId: number }

export function generalConv(conversations: Conversation[]): Conversation | null {
  return conversations.find((c) => c.isGeneral) ?? conversations[0] ?? null
}

export function activeConv(state: AppState): Conversation | null {
  return state.conversations.find((c) => c.id === state.activeConvId) ?? null
}

/** The greeting shown in an empty conversation. */
export function welcomeMessage(conv: Conversation): ChatMessage {
  if (conv.purpose) {
    return {
      who: 'bot',
      text:
        `أهلاً بك، هذه محادثة «${conv.title}» — ${conv.purpose}` +
        (conv.style ? `. طريقة معاملتي هنا: ${conv.style}` : '') +
        '. اكتب أول رسالة هنا، وستصلني ضمن هذه المحادثة وحدها.',
    }
  }
  if (!conv.isGeneral) {
    return {
      who: 'bot',
      text: `أهلاً بك، هذه محادثة «${conv.title}» الجديدة. اكتب أول رسالة هنا، وستصلني ضمن هذه المحادثة وحدها — وإن أردت تغيير الأسلوب أو أي شيء آخر، اطلبه مني هنا أثناء الدردشة.`,
    }
  }
  return {
    who: 'bot',
    text: 'أهلاً بك، أنا Muse. اسألني عن أي شيء، أو أرسل لي درساً أشرحه لك خطوة بخطوة.',
  }
}

export function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'go':
      return { ...state, view: action.view }
    case 'setDrawer':
      return { ...state, drawerOpen: action.open }
    case 'setAvatar':
      return { ...state, avatar: action.avatar }
    case 'setName':
      return { ...state, name: action.name }
    case 'toggleMorning':
      return { ...state, morning: !state.morning }
    case 'setNickname':
      return { ...state, nickname: action.nickname }
    case 'setStyle':
      return {
        ...state,
        style: action.style,
        memory: state.memory.map((m) =>
          m.label === 'لغة الردود' ? { ...m, value: action.style } : m,
        ),
      }
    case 'addMemory':
      return { ...state, memory: [...state.memory, action.item] }
    case 'deleteMemory':
      return { ...state, memory: state.memory.filter((_, i) => i !== action.index) }
    case 'clearMemory':
      return { ...state, memory: [] }
    case 'addReminder':
      return { ...state, reminders: [...state.reminders, action.reminder] }
    case 'deleteReminder':
      return { ...state, reminders: state.reminders.filter((_, i) => i !== action.index) }
    case 'setStudyMode':
      return { ...state, studyMode: action.mode }
    case 'setRemWhen':
      return { ...state, remWhen: action.when }
    case 'addConversation': {
      const conv: Conversation = {
        id: action.id,
        title: action.title,
        purpose: '',
        style: '',
        history: [],
        isGeneral: action.title === 'المحادثة العامة',
        remoteActive: false,
      }
      return {
        ...state,
        conversations: [...state.conversations, conv],
        nextConvId: state.nextConvId + 1,
      }
    }
    case 'deleteConversation': {
      const conversations = state.conversations.filter((c) => c.id !== action.id)
      let activeConvId = state.activeConvId
      if (activeConvId === action.id) {
        activeConvId = generalConv(conversations)?.id ?? null
      }
      return { ...state, conversations, activeConvId }
    }
    case 'openConversation':
      return { ...state, activeConvId: action.id, view: 'view-chat', drawerOpen: false }
    // Restores the active conversation without side effects (used when the
    // user goes back in history — no message is sent to the bot).
    case 'setActiveConv':
      return { ...state, activeConvId: action.id }
    case 'addChatMessage': {
      if (state.activeConvId === null) return state
      const conversations = state.conversations.map((c) =>
        c.id === state.activeConvId
          ? { ...c, history: [...c.history, { who: 'user', text: action.text } as ChatMessage] }
          : c,
      )
      return { ...state, conversations }
    }
    case 'applyStore':
      return { ...state, conversations: action.conversations, nextConvId: action.nextConvId }
    default:
      return state
  }
}
