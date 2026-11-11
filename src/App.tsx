import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { COMMANDS, PARENT, TAB_VIEWS, TITLES } from './data'
import { activeConv, createInitialState, generalConv, reducer } from './reducer'
import { fetchStoreState, mergeStoreState } from './store'
import {
  clearLinkCode,
  getTelegram,
  initTelegram,
  loadLinkCode,
  onTelegramBackButton,
  saveLinkCode,
  sendOrCopy,
  sendToBot,
  setTelegramBackButtonVisible,
} from './telegram'
import type { Avatar, Conversation, Reminder, ViewId } from './types'
import { BarAvatar } from './components/Avatar'
import Drawer from './components/Drawer'
import Toast from './components/Toast'
import {
  IconBack,
  IconChat,
  IconCloseSmall,
  IconHome,
  IconList,
  IconMenu,
} from './components/icons'
import HomeView from './views/HomeView'
import ChatView from './views/ChatView'
import OrdersView from './views/OrdersView'
import SpaceView from './views/SpaceView'
import {
  AboutView,
  BotPicView,
  FromView,
  MorningView,
  NameView,
  RulesView,
} from './views/SubViews'
import StudyView from './views/StudyView'
import RemindersView from './views/RemindersView'
import MemoryView from './views/MemoryView'

const LINK_STATUS_DEFAULT = 'مرتبط بسجلّ Muse — محادثاتك هنا هي نفسها في تيليجرام.'

/** One browser-history entry per navigation state: the view, whether the
 *  drawer is open, and which conversation is active. The URL never
 *  changes, so a refresh still loads the app. */
interface HistoryNavState {
  view: ViewId
  drawer: boolean
  conv: number | null
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, null, () => createInitialState())
  const [toastMsg, setToastMsg] = useState('')
  const [linkCode, setLinkCode] = useState('')
  const [linkInput, setLinkInput] = useState('')
  const [storeLinked, setStoreLinked] = useState(false)
  const [linkError, setLinkError] = useState('')
  const [linkStatus, setLinkStatus] = useState(LINK_STATUS_DEFAULT)

  const toastTimer = useRef<number | null>(null)
  const stateRef = useRef(state)
  stateRef.current = state
  const linkCodeRef = useRef(linkCode)
  linkCodeRef.current = linkCode

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg)
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToastMsg(''), 2400)
  }, [])

  useEffect(
    () => () => {
      if (toastTimer.current !== null) window.clearTimeout(toastTimer.current)
    },
    [],
  )

  /* ---------- Shared store ---------- */
  const refreshStore = useCallback(
    async (code: string, opts: { silent?: boolean; onSuccess?: () => void } = {}) => {
      if (!code) return
      const res = await fetchStoreState(code)
      if (!res.ok) {
        if (res.badCode) {
          setStoreLinked(false)
          setLinkError(
            'الرمز غير صحيح أو لم يعد صالحاً — اطلب رمزاً جديداً بإرسال /link للبوت في تيليجرام.',
          )
        } else if (!opts.silent) {
          setLinkError(
            res.networkError
              ? 'تعذّر الاتصال بالخادم — تحقّق من الإنترنت وحاول مجدداً.'
              : 'تعذّر قراءة السجلّ الآن — حاول مجدداً بعد قليل.',
          )
        }
        return
      }
      setLinkError('')
      setStoreLinked(true)
      const merged = mergeStoreState(
        stateRef.current.conversations,
        stateRef.current.nextConvId,
        res.data,
      )
      dispatch({
        type: 'applyStore',
        conversations: merged.conversations,
        nextConvId: merged.nextConvId,
      })
      setLinkStatus(
        'مرتبط بسجلّ Muse — آخر تحديث: ' +
          new Date().toLocaleTimeString('ar', { hour: 'numeric', minute: '2-digit' }),
      )
      opts.onSuccess?.()
      if (!opts.silent) showToast('تمّ تحديث محادثاتك من سجلّ Muse')
    },
    [showToast],
  )

  // On load: init the Telegram bridge and, if a pairing code was saved in
  // CloudStorage, restore the link silently.
  useEffect(() => {
    initTelegram()
    loadLinkCode((code) => {
      setLinkCode(code)
      void refreshStore(code, { silent: true })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Re-read the shared store every minute while linked.
  useEffect(() => {
    if (!storeLinked) return
    const timer = window.setInterval(() => {
      const code = linkCodeRef.current
      if (code) void refreshStore(code, { silent: true })
    }, 60000)
    return () => window.clearInterval(timer)
  }, [storeLinked, refreshStore])

  // Sub-views hide the bottom tab bar (body.nav-sub).
  useEffect(() => {
    document.body.classList.toggle('nav-sub', !TAB_VIEWS.includes(state.view))
  }, [state.view])

  // Escape closes the drawer.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dispatch({ type: 'setDrawer', open: false })
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  /* ---------- Browser history (Android back button) ---------- */
  const historyStateRef = useRef<HistoryNavState | null>(null)
  const poppingRef = useRef(false)

  // Seed the first entry with the home view: back from home leaves the
  // app, as it should. Declared before the sync effect below so it runs
  // first on mount.
  useEffect(() => {
    const initial: HistoryNavState = {
      view: 'view-main',
      drawer: false,
      conv: generalConv(stateRef.current.conversations)?.id ?? null,
    }
    window.history.replaceState(initial, '')
    historyStateRef.current = initial
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Keep the history stack in step with navigation. A view change or an
  // opened drawer pushes a new entry; closing the drawer (or switching
  // the conversation in place) rewrites the current entry, so "back"
  // never re-opens a drawer the user already closed.
  useEffect(() => {
    const next: HistoryNavState = {
      view: state.view,
      drawer: state.drawerOpen,
      conv: state.activeConvId,
    }
    const prev = historyStateRef.current
    if (poppingRef.current) {
      poppingRef.current = false
      historyStateRef.current = next
      return
    }
    if (
      prev &&
      prev.view === next.view &&
      prev.drawer === next.drawer &&
      prev.conv === next.conv
    ) {
      return
    }
    const push = !prev || prev.view !== next.view || (!prev.drawer && next.drawer)
    if (push) window.history.pushState(next, '')
    else window.history.replaceState(next, '')
    historyStateRef.current = next
  }, [state.view, state.drawerOpen, state.activeConvId])

  // Restore the previous view when the user goes back — Android's system
  // back button and Telegram's back button both funnel through history.
  useEffect(() => {
    const onPopState = (e: PopStateEvent) => {
      const s = e.state as HistoryNavState | null
      poppingRef.current = true
      if (!s || typeof s.view !== 'string') {
        dispatch({ type: 'go', view: 'view-main' })
        dispatch({ type: 'setDrawer', open: false })
        return
      }
      dispatch({ type: 'go', view: s.view })
      dispatch({ type: 'setDrawer', open: s.drawer })
      if (typeof s.conv === 'number') {
        const exists = stateRef.current.conversations.some((c) => c.id === s.conv)
        if (exists) dispatch({ type: 'setActiveConv', id: s.conv })
      }
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  // Telegram's back button (and the Android system back button inside
  // Telegram, which fires the same event) goes through history, exactly
  // like the browser's back button.
  useEffect(() => {
    const off = onTelegramBackButton(() => window.history.back())
    return off
  }, [])

  // Show Telegram's back button whenever there is somewhere to go back
  // to: any view other than home, or an open drawer.
  useEffect(() => {
    setTelegramBackButtonVisible(state.view !== 'view-main' || state.drawerOpen)
  }, [state.view, state.drawerOpen])

  /* ---------- Navigation ---------- */
  const go = (view: ViewId) => {
    dispatch({ type: 'go', view })
    window.scrollTo(0, 0)
  }

  const openConversation = (id: number) => {
    dispatch({ type: 'openConversation', id })
    const conv = stateRef.current.conversations.find((c) => c.id === id)
    if (conv) sendToBot({ type: 'switch_conversation', title: conv.title })
    window.scrollTo(0, 0)
  }

  const openMainConversation = () => {
    const gen = generalConv(stateRef.current.conversations)
    if (gen) openConversation(gen.id)
  }

  const goSpace = () => {
    dispatch({ type: 'setDrawer', open: false })
    go('view-space')
  }

  const createConversation = (title: string): boolean => {
    if (!title) {
      showToast('اكتب اسم المحادثة أولاً')
      return false
    }
    if (stateRef.current.conversations.some((c) => c.title === title)) {
      showToast('توجد محادثة بهذا الاسم أصلاً — اختر اسماً آخر')
      return false
    }
    const id = stateRef.current.nextConvId
    dispatch({ type: 'addConversation', id, title })
    sendToBot({ type: 'new_conversation', title })
    showToast(`أُنشئت محادثة «${title}»`)
    openConversation(id)
    return true
  }

  const deleteConversation = (conv: Conversation) => {
    sendToBot({ type: 'delete_conversation', title: conv.title })
    dispatch({ type: 'deleteConversation', id: conv.id })
    showToast(`حُذفت محادثة «${conv.title}»`)
  }

  /* ---------- Chat ---------- */
  const handleSendChat = (text: string) => {
    const conv = activeConv(stateRef.current)
    if (!conv) return
    dispatch({ type: 'addChatMessage', text })
    sendToBot({ type: 'message', conversation: conv.title, text })
    showToast(`أُرسلت إلى Muse في محادثة «${conv.title}»`)
  }

  /* ---------- Link ---------- */
  const handleLink = () => {
    const value = linkInput.trim()
    if (!value) {
      setLinkError('الصق رمز الربط أولاً — تجده بإرسال /link للبوت في تيليجرام.')
      return
    }
    setLinkCode(value)
    setLinkError('')
    void refreshStore(value, {
      onSuccess: () => {
        saveLinkCode(value)
        showToast('تمّ الربط — محادثاتك من تيليجرام وهنا واحدة')
      },
    })
  }

  const handleUnlink = () => {
    setLinkCode('')
    setStoreLinked(false)
    clearLinkCode()
    setLinkError('')
    showToast('أُلغي الربط من هذا الجهاز — محادثاتك محفوظة عند Muse كما هي')
  }

  /* ---------- Header ---------- */
  const handleClose = () => {
    const tg = getTelegram()
    if (tg) {
      tg.close()
      return
    }
    showToast('زر الإغلاق يعمل داخل تيليجرام — هذه معاينة متصفح')
  }

  /* ---------- Sub-view actions ---------- */
  const handleSaveName = (value: string) => {
    if (!value) {
      showToast('اكتب اسماً أولاً')
      return
    }
    dispatch({ type: 'setName', name: value })
    sendToBot({ type: 'set_name', name: value })
    showToast('تمّ تحديث اسم البوت')
    go('view-space')
  }

  const handlePickAvatar = (avatar: Avatar) => {
    dispatch({ type: 'setAvatar', avatar })
    sendToBot({ type: 'set_botpic', avatar })
    showToast('تمّ تغيير صورة البوت')
  }

  const handleToggleMorning = () => {
    const next = !stateRef.current.morning
    dispatch({ type: 'toggleMorning' })
    sendToBot({ type: 'morning_message', enabled: next })
    showToast(next ? 'رسالة الصباح مفعّلة' : 'رسالة الصباح متوقفة')
  }

  const handleAddReminder = (reminder: Reminder) => {
    dispatch({ type: 'addReminder', reminder })
    sendToBot({ type: 'add_reminder', text: reminder.text, when: reminder.when })
    showToast('تمّت إضافة التذكير')
  }

  const handleDeleteReminder = (index: number) => {
    const reminder = stateRef.current.reminders[index]
    if (!reminder) return
    sendToBot({ type: 'delete_reminder', text: reminder.text, when: reminder.when })
    dispatch({ type: 'deleteReminder', index })
    showToast('تمّ حذف التذكير')
  }

  const handleSaveNick = (nickname: string) => {
    dispatch({ type: 'setNickname', nickname })
    sendToBot({ type: 'set_nickname', nickname })
    showToast(`سأناديك: ${nickname}`)
  }

  const handleStyleChange = (style: string) => {
    dispatch({ type: 'setStyle', style })
    sendToBot({ type: 'set_style', style })
    showToast(`أسلوب الردود: ${style}`)
  }

  const handleAddMemory = (label: string, value: string) => {
    dispatch({ type: 'addMemory', item: { label, value } })
    sendToBot({ type: 'remember', label, value })
    showToast('تمّ حفظ المعلومة')
  }

  const handleDeleteMemory = (index: number) => {
    const item = stateRef.current.memory[index]
    if (!item) return
    sendToBot({ type: 'forget', label: item.label })
    dispatch({ type: 'deleteMemory', index })
    showToast('تمّ مسح المعلومة')
  }

  const handleClearMemory = () => {
    dispatch({ type: 'clearMemory' })
    sendToBot({ type: 'clear_memory' })
    showToast('تمّ مسح كل شيء')
  }

  /* ---------- Render ---------- */
  const isTab = TAB_VIEWS.includes(state.view)
  const activeTab: ViewId = isTab ? state.view : (PARENT[state.view] ?? 'view-main')
  const conversation = activeConv(state)

  return (
    <>
      <div className="app">
        <header className={isTab ? 'appbar' : 'appbar in-sub'}>
          <button
            className="menu-btn"
            type="button"
            aria-label="فتح اللوحة الجانبية — المحادثات"
            onClick={() => dispatch({ type: 'setDrawer', open: true })}
          >
            <IconMenu />
          </button>
          <button className="close-pill" type="button" aria-label="إغلاق" onClick={handleClose}>
            <IconCloseSmall />
            إغلاق
          </button>
          <button className="back-btn" type="button" onClick={() => go(PARENT[state.view] ?? 'view-main')}>
            <IconBack />
            رجوع
          </button>
          <span className="bar-title">{TITLES[state.view]}</span>
          <BarAvatar avatar={state.avatar} />
        </header>

        <main>
          <HomeView
            active={state.view === 'view-main'}
            name={state.name}
            avatar={state.avatar}
            morning={state.morning}
            commandsCount={COMMANDS.length}
          />
          <ChatView
            active={state.view === 'view-chat'}
            conversation={conversation}
            linkCode={linkInput}
            storeLinked={storeLinked}
            linkError={linkError}
            linkStatus={linkStatus}
            onLinkCodeChange={setLinkInput}
            onLink={handleLink}
            onRefresh={() => void refreshStore(linkCode, {})}
            onUnlink={handleUnlink}
            onSendChat={handleSendChat}
            onOpenDrawer={() => dispatch({ type: 'setDrawer', open: true })}
            toast={showToast}
          />
          <OrdersView
            active={state.view === 'view-orders'}
            onCommand={(cmd) => sendOrCopy('/' + cmd, 'تمّ نسخ الأمر', showToast)}
          />
          <SpaceView
            active={state.view === 'view-space'}
            remindersCount={state.reminders.length}
            onGo={go}
          />
          <NameView active={state.view === 'view-name'} name={state.name} onSave={handleSaveName} />
          <AboutView active={state.view === 'view-about'} about={state.about} />
          <BotPicView active={state.view === 'view-botpic'} avatar={state.avatar} onPick={handlePickAvatar} />
          <MorningView active={state.view === 'view-morning'} morning={state.morning} onToggle={handleToggleMorning} />
          <StudyView
            active={state.view === 'view-study'}
            mode={state.studyMode}
            onModeChange={(mode) => dispatch({ type: 'setStudyMode', mode })}
            onSendRequest={(text) => sendOrCopy(text, 'تمّ نسخ طلب الدراسة', showToast)}
            toast={showToast}
          />
          <RemindersView
            active={state.view === 'view-reminders'}
            reminders={state.reminders}
            remWhen={state.remWhen}
            onRemWhenChange={(when) => dispatch({ type: 'setRemWhen', when })}
            onAdd={handleAddReminder}
            onDelete={handleDeleteReminder}
            toast={showToast}
          />
          <MemoryView
            active={state.view === 'view-memory'}
            nickname={state.nickname}
            style={state.style}
            memory={state.memory}
            onSaveNick={handleSaveNick}
            onStyleChange={handleStyleChange}
            onAddMemory={handleAddMemory}
            onDeleteMemory={handleDeleteMemory}
            onClearMemory={handleClearMemory}
            toast={showToast}
          />
          <FromView
            active={state.view === 'view-from'}
            onRequest={() => sendOrCopy('/message-from-owner', 'تمّ نسخ الأمر', showToast)}
          />
          <RulesView active={state.view === 'view-rules'} about={state.about} />
        </main>
      </div>

      <Drawer
        open={state.drawerOpen}
        conversations={state.conversations}
        activeConvId={state.activeConvId}
        onClose={() => dispatch({ type: 'setDrawer', open: false })}
        onOpen={openConversation}
        onDelete={deleteConversation}
        onCreate={createConversation}
        onGoSpace={goSpace}
      />

      <nav className="tabbar" aria-label="التنقّل الرئيسي">
        <button
          className={'tab-btn' + (activeTab === 'view-main' ? ' active' : '')}
          type="button"
          onClick={() => go('view-main')}
        >
          <IconHome />
          <span>الرئيسية</span>
        </button>
        <button
          className={'tab-btn' + (activeTab === 'view-chat' ? ' active' : '')}
          type="button"
          onClick={() => {
            go('view-chat')
            openMainConversation()
          }}
        >
          <IconChat />
          <span>المحادثة الرئيسية</span>
        </button>
        <button
          className={'tab-btn' + (activeTab === 'view-orders' ? ' active' : '')}
          type="button"
          onClick={() => go('view-orders')}
        >
          <IconList />
          <span>أوامري</span>
        </button>
      </nav>

      <Toast message={toastMsg} />
    </>
  )
}
