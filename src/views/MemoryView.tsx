import { useEffect, useRef, useState } from 'react'
import { STYLE_OPTIONS } from '../data'
import type { MemoryItem } from '../types'
import { IconTrash } from '../components/icons'

interface MemoryViewProps {
  active: boolean
  nickname: string
  style: string
  memory: MemoryItem[]
  onSaveNick: (nickname: string) => void
  onStyleChange: (style: string) => void
  onAddMemory: (label: string, value: string) => void
  onDeleteMemory: (index: number) => void
  onClearMemory: () => void
  toast: (msg: string) => void
}

export default function MemoryView({
  active,
  nickname,
  style,
  memory,
  onSaveNick,
  onStyleChange,
  onAddMemory,
  onDeleteMemory,
  onClearMemory,
  toast,
}: MemoryViewProps) {
  const [nick, setNick] = useState(nickname)
  const [label, setLabel] = useState('')
  const [value, setValue] = useState('')
  const [clearArmed, setClearArmed] = useState(false)
  const clearTimer = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (clearTimer.current !== null) window.clearTimeout(clearTimer.current)
    },
    [],
  )

  const handleClear = () => {
    if (!clearArmed) {
      setClearArmed(true)
      clearTimer.current = window.setTimeout(() => setClearArmed(false), 3500)
      return
    }
    if (clearTimer.current !== null) window.clearTimeout(clearTimer.current)
    setClearArmed(false)
    onClearMemory()
  }

  const handleAdd = () => {
    const l = label.trim()
    const v = value.trim()
    if (!l || !v) {
      toast('اكتب العنوان والقيمة')
      return
    }
    onAddMemory(l, v)
    setLabel('')
    setValue('')
  }

  const handleSaveNick = () => {
    const v = nick.trim()
    if (!v) {
      toast('اكتب الاسم أولاً')
      return
    }
    onSaveNick(v)
  }

  return (
    <section className={active ? 'view active' : 'view'} id="view-memory">
      <div className="prompt-bubble">
        هذه مساحتك الخاصة: ما أعرفه عنك محفوظ هنا، وتستطيع تعديله أو مسحه في أي وقت. لا يطّلع عليه أحد غيرك.
      </div>
      <div className="form-card">
        <label className="field-label" htmlFor="nickInput">
          الاسم الذي أناديك به
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            className="text-input"
            id="nickInput"
            type="text"
            style={{ flex: 1 }}
            value={nick}
            onChange={(e) => setNick(e.target.value)}
          />
          <button
            className="chip"
            type="button"
            onClick={handleSaveNick}
            style={{ background: 'var(--accent)', color: '#fff', minHeight: 48 }}
          >
            حفظ
          </button>
        </div>
        <span className="field-label" style={{ marginTop: 16 }}>
          أسلوب الردود
        </span>
        <div className="chips">
          {STYLE_OPTIONS.map((option) => (
            <button
              key={option}
              className={'chip' + (style === option ? ' selected' : '')}
              type="button"
              onClick={() => onStyleChange(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <div className="item-list">
        {memory.map((item, index) => (
          <div className="item-row" key={`${item.label}-${index}`}>
            <span className="body">
              <span className="main-line">{item.value}</span>
              <span className="sub-line">{item.label}</span>
            </span>
            <button
              type="button"
              className="icon-btn danger"
              aria-label="حذف المعلومة"
              onClick={() => onDeleteMemory(index)}
            >
              <IconTrash />
            </button>
          </div>
        ))}
      </div>
      <div className="form-card">
        <label className="field-label" htmlFor="memLabel">
          علّمني شيئاً جديداً عنك
        </label>
        <input
          className="text-input"
          id="memLabel"
          type="text"
          placeholder="العنوان — مثال: مادتي المفضلة"
          style={{ marginBottom: 9 }}
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <input
          className="text-input"
          id="memValue"
          type="text"
          placeholder="القيمة — مثال: أحب القهوة في الصباح"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <button className="save-btn" type="button" onClick={handleAdd}>
        حفظ المعلومة
      </button>
      <button className="danger-btn" type="button" onClick={handleClear}>
        {clearArmed ? 'متأكد؟ اضغط مرة أخرى للمسح النهائي' : 'مسح كل ما يعرفه البوت عني'}
      </button>
    </section>
  )
}
