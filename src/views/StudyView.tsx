import { useRef, useState } from 'react'
import { STUDY_PREFIXES } from '../data'
import type { StudyMode } from '../types'
import { IconBook, IconFile, IconQuiz } from '../components/icons'

interface StudyViewProps {
  active: boolean
  mode: StudyMode
  onModeChange: (mode: StudyMode) => void
  onSendRequest: (text: string) => void
  toast: (msg: string) => void
}

const MODES: { mode: StudyMode; icon: React.ReactNode; title: string; text: string }[] = [
  { mode: 'explain', icon: <IconBook />, title: 'اشرح لي درساً', text: 'شرح مبسّط خطوة بخطوة، بمثال لكل فكرة.' },
  { mode: 'summary', icon: <IconFile />, title: 'لخّص لي ملفاً', text: 'أرسل الملف في المحادثة، وسألخّصه في نقاط واضحة.' },
  { mode: 'quiz', icon: <IconQuiz />, title: 'اختبرني', text: 'أسئلة اختبار عن الدرس، مع تصحيح إجاباتك أولاً بأول.' },
]

export default function StudyView({ active, mode, onModeChange, onSendRequest, toast }: StudyViewProps) {
  const [topic, setTopic] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSend = () => {
    const value = topic.trim()
    if (!value) {
      toast('اكتب موضوع الدرس أولاً')
      inputRef.current?.focus()
      return
    }
    onSendRequest(STUDY_PREFIXES[mode] + value)
  }

  return (
    <section className={active ? 'view active' : 'view'} id="view-study">
      <div className="prompt-bubble">
        أخبرني بما تدرسه وسأساعدك: أشرح الدرس خطوة بخطوة، أو ألخّص ملفاً ترسله، أو أضع لك أسئلة اختبار
        وأصحّح إجاباتك.
      </div>
      <div className="mode-cards">
        {MODES.map((m) => (
          <button
            key={m.mode}
            className={'mode-card' + (mode === m.mode ? ' selected' : '')}
            type="button"
            onClick={() => onModeChange(m.mode)}
          >
            <span className={`ic ${m.mode === 'explain' ? 'ic-blue' : m.mode === 'summary' ? 'ic-pink' : 'ic-gold'}`}>
              {m.icon}
            </span>
            <span>
              <span className="t1">{m.title}</span>
              <span className="t2">{m.text}</span>
            </span>
          </button>
        ))}
      </div>
      <div className="form-card">
        <label className="field-label" htmlFor="studyTopic">
          موضوع الدرس
        </label>
        <input
          className="text-input"
          id="studyTopic"
          ref={inputRef}
          type="text"
          placeholder="مثال: درس الرياضيات — المعادلات من الدرجة الأولى"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
      </div>
      <button className="save-btn" type="button" onClick={handleSend}>
        إرسال طلب الدراسة إلى البوت
      </button>
      <p className="hint">يُرسل الطلب إلى البوت مباشرة داخل تيليجرام ليبدأ العمل فوراً، أو يُنسخ إن فتحت التطبيق من المتصفح.</p>
    </section>
  )
}
