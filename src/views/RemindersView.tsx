import { useRef, useState } from 'react'
import { REMINDER_PRESETS } from '../data'
import type { Reminder } from '../types'
import { IconTrash } from '../components/icons'

interface RemindersViewProps {
  active: boolean
  reminders: Reminder[]
  remWhen: string
  onRemWhenChange: (when: string) => void
  onAdd: (reminder: Reminder) => void
  onDelete: (index: number) => void
  toast: (msg: string) => void
}

function formatCustomWhen(value: string): string {
  const d = new Date(value)
  return (
    d.toLocaleDateString('ar', { weekday: 'long', day: 'numeric', month: 'long' }) +
    ' — ' +
    d.toLocaleTimeString('ar', { hour: 'numeric', minute: '2-digit' })
  )
}

export default function RemindersView({
  active,
  reminders,
  remWhen,
  onRemWhenChange,
  onAdd,
  onDelete,
  toast,
}: RemindersViewProps) {
  const [text, setText] = useState('')
  const [custom, setCustom] = useState('')
  const textRef = useRef<HTMLInputElement>(null)

  const handleAdd = () => {
    const value = text.trim()
    if (!value) {
      toast('اكتب نصّ التذكير أولاً')
      textRef.current?.focus()
      return
    }
    let when = remWhen
    if (when === 'custom') {
      if (!custom) {
        toast('اختر الوقت المخصص')
        return
      }
      when = formatCustomWhen(custom)
    }
    onAdd({ text: value, when })
    setText('')
  }

  return (
    <section className={active ? 'view active' : 'view'} id="view-reminders">
      <div className="prompt-bubble">
        اكتب التذكير ووقته، مثل: <code>/remind</code> بعد ساعة اشرب الدواء — وسأرسله لك في وقته تماماً.
      </div>
      <div className="item-list">
        {reminders.map((reminder, index) => (
          <div className="item-row" key={`${reminder.text}-${reminder.when}-${index}`}>
            <span className="body">
              <span className="main-line">{reminder.text}</span>
              <span className="sub-line">{reminder.when}</span>
            </span>
            <button type="button" className="icon-btn danger" aria-label="حذف التذكير" onClick={() => onDelete(index)}>
              <IconTrash />
            </button>
          </div>
        ))}
      </div>
      {!reminders.length && (
        <div className="empty-state">
          لا تذكيرات بعد.
          <br />
          أضف أول تذكير من النموذج في الأسفل.
        </div>
      )}
      <div className="form-card">
        <label className="field-label" htmlFor="remText">
          نصّ التذكير
        </label>
        <input
          className="text-input"
          id="remText"
          ref={textRef}
          type="text"
          placeholder="مثال: اشرب الدواء"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <span className="field-label" style={{ marginTop: 14 }}>
          الوقت
        </span>
        <div className="chips">
          {[...REMINDER_PRESETS, 'custom'].map((when) => (
            <button
              key={when}
              className={'chip' + (remWhen === when ? ' selected' : '')}
              type="button"
              onClick={() => onRemWhenChange(when)}
            >
              {when === 'custom' ? 'وقت مخصص' : when}
            </button>
          ))}
        </div>
        <div className={remWhen === 'custom' ? '' : 'hidden'} style={{ marginTop: 12 }}>
          <input
            className="text-input"
            type="datetime-local"
            aria-label="الوقت المخصص"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
          />
        </div>
      </div>
      <button className="save-btn" type="button" onClick={handleAdd}>
        إضافة التذكير
      </button>
    </section>
  )
}
