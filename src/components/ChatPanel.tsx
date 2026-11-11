import { useEffect, useRef, useState } from 'react'
import { welcomeMessage } from '../reducer'
import type { ChatMessage, Conversation } from '../types'
import { IconHeartFill, IconSend } from './icons'

interface ChatPanelProps {
  conversation: Conversation | null
  onSend: (text: string) => void
  onOpenDrawer: () => void
}

function headPurpose(conv: Conversation): string {
  const parts: string[] = []
  if (conv.purpose) parts.push(conv.purpose)
  if (conv.style) parts.push('طريقة المعاملة: ' + conv.style)
  if (!parts.length) {
    parts.push(
      conv.isGeneral
        ? 'محادثة عامة — لأي موضوع'
        : 'اطلب داخل المحادثة تغيير الأسلوب أو أي شيء آخر متى شئت',
    )
  }
  return parts.join(' · ')
}

function ChatRow({ message }: { message: ChatMessage }) {
  return (
    <div className={message.who === 'user' ? 'chat-row user' : 'chat-row'}>
      {message.who !== 'user' && (
        <span className="spark">
          <IconHeartFill />
        </span>
      )}
      <span className="chat-bubble">{message.text}</span>
    </div>
  )
}

export default function ChatPanel({ conversation, onSend, onOpenDrawer }: ChatPanelProps) {
  const [input, setInput] = useState('')
  const [scrollToken, setScrollToken] = useState(0)
  const logRef = useRef<HTMLDivElement>(null)

  // After a message is sent, bring it into view.
  useEffect(() => {
    if (scrollToken === 0) return
    const last = logRef.current?.lastElementChild as HTMLElement | null
    last?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [scrollToken])

  if (!conversation) return null
  const messages = conversation.history.length ? conversation.history : [welcomeMessage(conversation)]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const value = input.trim()
    if (!value) return
    setInput('')
    onSend(value)
    setScrollToken((t) => t + 1)
  }

  return (
    <div>
      <div className="conv-head">
        <button className="chip" type="button" onClick={onOpenDrawer}>
          كل المحادثات
        </button>
        <span className="tt">
          <span className="t1">{conversation.title}</span>
          <span className="t2">{headPurpose(conversation)}</span>
        </span>
      </div>
      <div className="chat-card" aria-label="محادثتي مع البوت">
        <div ref={logRef} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.map((message, i) => (
            <ChatRow key={`${i}-${message.who}-${message.text.slice(0, 24)}`} message={message} />
          ))}
        </div>
        <form className="chat-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="اكتب رسالتك هنا…"
            aria-label="اكتب رسالتك"
            autoComplete="off"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="send-btn" type="submit" aria-label="إرسال">
            <IconSend />
          </button>
        </form>
      </div>
    </div>
  )
}
