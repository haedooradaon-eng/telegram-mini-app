import { useRef, useState } from 'react'
import type { Conversation } from '../types'
import { IconChevron, IconClose, IconTrash, IconUser } from './icons'

interface DrawerProps {
  open: boolean
  conversations: Conversation[]
  activeConvId: number | null
  onClose: () => void
  onOpen: (id: number) => void
  onDelete: (conv: Conversation) => void
  /** Returns true when the conversation was created. */
  onCreate: (title: string) => boolean
  /** Go to «مساحتي» (view-space). */
  onGoSpace: () => void
}

function convSubLine(conv: Conversation): string {
  const parts: string[] = []
  if (conv.purpose) parts.push(conv.purpose)
  if (conv.style) parts.push('المعاملة: ' + conv.style)
  parts.push(conv.history.length + (conv.history.length === 1 ? ' رسالة' : ' رسائل'))
  return parts.join(' · ')
}

export default function Drawer({
  open,
  conversations,
  activeConvId,
  onClose,
  onOpen,
  onDelete,
  onCreate,
  onGoSpace,
}: DrawerProps) {
  const [title, setTitle] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleCreate = () => {
    const ok = onCreate(title.trim())
    if (ok) {
      setTitle('')
    } else {
      inputRef.current?.focus()
    }
  }

  return (
    <>
      <div
        className={open ? 'drawer-scrim show' : 'drawer-scrim'}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={open ? 'drawer open' : 'drawer'} aria-label="اللوحة الجانبية" aria-hidden={!open}>
        <div className="drawer-head">
          <span className="drawer-title">المحادثات</span>
          <button className="icon-btn" type="button" onClick={onClose} aria-label="إغلاق اللوحة الجانبية">
            <IconClose />
          </button>
        </div>
        <div className="drawer-body">
          <div className="form-card">
            <label className="field-label" htmlFor="convTitle">
              محادثة جديدة
            </label>
            <input
              className="text-input"
              id="convTitle"
              ref={inputRef}
              type="text"
              maxLength={60}
              placeholder="اسم المحادثة — مثال: الدراسة"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreate()
              }}
            />
          </div>
          <button className="save-btn" type="button" onClick={handleCreate}>
            إنشاء المحادثة
          </button>

          <h3 className="drawer-sub">فتح محادثة</h3>
          <div className="item-list">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className={'item-row clickable' + (conv.id === activeConvId ? ' conv-active' : '')}
                onClick={() => onOpen(conv.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onOpen(conv.id)
                }}
              >
                <span className="body">
                  <span className="main-line">
                    {conv.title}
                    {conv.remoteActive && <span className="active-badge">النشطة الآن</span>}
                  </span>
                  <span className="sub-line">{convSubLine(conv)}</span>
                </span>
                {!conv.isGeneral && (
                  <button
                    type="button"
                    className="icon-btn danger"
                    aria-label="حذف المحادثة"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(conv)
                    }}
                  >
                    <IconTrash />
                  </button>
                )}
                <span className="chev">
                  <IconChevron />
                </span>
              </div>
            ))}
          </div>
          {!conversations.length && (
            <div className="empty-state">
              لا محادثات بعد.
              <br />
              أنشئ أول محادثة من النموذج في الأعلى.
            </div>
          )}
        </div>
        <footer className="drawer-foot">
          <button className="drawer-space-btn" type="button" onClick={onGoSpace} aria-label="مساحتي — كل شيء في مكان واحد">
            <IconUser />
            <span className="drawer-space-text">
              <span className="drawer-space-title">مساحتي</span>
              <span className="drawer-space-desc">كل شيء في مكان واحد</span>
            </span>
          </button>
        </footer>
      </aside>
    </>
  )
}
