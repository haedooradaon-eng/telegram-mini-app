import type { Conversation } from '../types'
import ChatPanel from '../components/ChatPanel'
import { getTelegram } from '../telegram'

interface ChatViewProps {
  active: boolean
  conversation: Conversation | null
  linkCode: string
  storeLinked: boolean
  linkError: string
  linkStatus: string
  onLinkCodeChange: (value: string) => void
  onLink: () => void
  onRefresh: () => void
  onUnlink: () => void
  onSendChat: (text: string) => void
  onOpenDrawer: () => void
  toast: (msg: string) => void
}

export default function ChatView({
  active,
  conversation,
  linkCode,
  storeLinked,
  linkError,
  linkStatus,
  onLinkCodeChange,
  onLink,
  onRefresh,
  onUnlink,
  onSendChat,
  onOpenDrawer,
  toast,
}: ChatViewProps) {
  const handleOpenBotChat = () => {
    const tg = getTelegram()
    if (tg) {
      tg.close()
      return
    }
    toast('هذا الزر يعمل داخل تيليجرام — يغلق التطبيق ويعيدك إلى محادثة البوت')
  }

  return (
    <section className={active ? 'view active' : 'view'} id="view-chat">
      <p className="chat-note">
        هذه محادثتك الرئيسية — لأي موضوع. لإنشاء محادثة جديدة يكفي أن تختار اسمها من اللوحة الجانبية (زر
        القائمة في الأعلى)، ومنها أيضاً تفتح أي محادثة سابقة. وإن أردت تغيير الأسلوب أو الموضوع داخل أي
        محادثة، اطلب ذلك مني أثناء الدردشة نفسها. ومحادثاتك واحدة في تيليجرام وهنا: أنشئها من أيّ جهة
        وافتحها وأكملها من الجهة الأخرى.
      </p>

      <div className="form-card" style={{ margin: '0 16px 14px' }}>
        <span className="field-label" style={{ marginBottom: 4 }}>
          ربط التطبيق بسجلّ محادثاتك
        </span>
        <p className="hint" style={{ margin: '0 0 10px' }}>
          ليعرض التطبيق المحادثات التي أنشأتها من تيليجرام وسجلّ رسائلها، اربطه مرة واحدة: أرسل{' '}
          <code>/link</code> للبوت في تيليجرام، والصق هنا الرمز الذي يردّ به.
        </p>
        <div className={storeLinked ? 'hidden' : ''}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              className="text-input"
              type="text"
              placeholder="رمز الربط من البوت"
              aria-label="رمز الربط"
              style={{ flex: 1 }}
              autoComplete="off"
              autoCapitalize="none"
              value={linkCode}
              onChange={(e) => onLinkCodeChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onLink()
              }}
            />
            <button
              className="chip"
              type="button"
              onClick={onLink}
              style={{ background: 'var(--accent)', color: '#fff', minHeight: 42 }}
            >
              ربط
            </button>
          </div>
          <p className="hint" style={{ margin: '8px 0 0', display: linkError ? 'block' : 'none' }}>
            {linkError}
          </p>
        </div>
        <div className={storeLinked ? '' : 'hidden'}>
          <p className="hint" style={{ margin: '0 0 10px' }}>
            {linkStatus}
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="chip" type="button" onClick={onRefresh}>
              تحديث المحادثات
            </button>
            <button className="chip" type="button" onClick={onUnlink}>
              إلغاء الربط
            </button>
          </div>
        </div>
      </div>

      <button className="ghost-btn" type="button" onClick={handleOpenBotChat} style={{ margin: '14px 16px 0' }}>
        فتح محادثة البوت في تيليجرام
      </button>

      <div>
        <ChatPanel conversation={conversation} onSend={onSendChat} onOpenDrawer={onOpenDrawer} />
      </div>
    </section>
  )
}
