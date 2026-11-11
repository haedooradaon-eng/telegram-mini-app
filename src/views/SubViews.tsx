import { useState } from 'react'
import { MORNING_MESSAGES, PIC_OPTIONS, isPicSelected } from '../data'
import type { Avatar } from '../types'
import { IconBan, IconLock, IconShieldCheck } from '../components/icons'

/* ---------- Edit name ---------- */
export function NameView({
  active,
  name,
  onSave,
}: {
  active: boolean
  name: string
  onSave: (name: string) => void
}) {
  const [value, setValue] = useState(name)
  return (
    <section className={active ? 'view active' : 'view'} id="view-name">
      <div className="prompt-bubble">حسناً. أرسل الاسم الجديد للبوت. سيظهر هذا الاسم في أعلى المحادثة وفي صفحة البوت.</div>
      <div className="form-card">
        <label className="field-label" htmlFor="nameInput">
          اسم البوت
        </label>
        <input
          className="text-input"
          id="nameInput"
          type="text"
          maxLength={64}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <button className="save-btn" type="button" onClick={() => onSave(value.trim())}>
        حفظ الاسم
      </button>
    </section>
  )
}

/* ---------- About (view only) ---------- */
export function AboutView({ active, about }: { active: boolean; about: string }) {
  return (
    <section className={active ? 'view active' : 'view'} id="view-about">
      <div className="prompt-bubble">
        هذا هو نصّ «النبذة» الحالي للبوت. يظهر عند فتح /about، ويُرسل مع رابط البوت عندما يشاركه أحد.
      </div>
      <div className="form-card">
        <p className="about-text">{about}</p>
      </div>
      <p className="lock-note">
        <IconLock />
        <span>النبذة ثابتة كما ضبطها مالك البوت، وتُعرض هنا للاطّلاع فقط.</span>
      </p>
    </section>
  )
}

/* ---------- Bot picture ---------- */
export function BotPicView({
  active,
  avatar,
  onPick,
}: {
  active: boolean
  avatar: Avatar
  onPick: (avatar: Avatar) => void
}) {
  return (
    <section className={active ? 'view active' : 'view'} id="view-botpic">
      <div className="prompt-bubble">حسناً. اختر صورة جديدة للبوت، وستتغيّر فوراً في أعلى الواجهة وفي المحادثة.</div>
      <div className="pic-grid">
        {PIC_OPTIONS.map((option) => (
          <button
            key={option.key}
            className={'pic-opt' + (isPicSelected(option, avatar) ? ' selected' : '')}
            type="button"
            aria-label={option.label}
            onClick={() => onPick(option.avatar)}
          >
            {option.avatar.kind === 'img' ? (
              <img src={option.avatar.src} alt={option.alt} />
            ) : (
              <span className={`letter-tile ${option.avatar.g}`}>{option.avatar.letter}</span>
            )}
          </button>
        ))}
      </div>
      <p className="hint">أو أرسل أي صورة من هاتفك في محادثة البوت واكتب: «اجعل هذه صورة البوت».</p>
    </section>
  )
}

/* ---------- Morning message ---------- */
export function MorningView({
  active,
  morning,
  onToggle,
}: {
  active: boolean
  morning: boolean
  onToggle: () => void
}) {
  return (
    <section className={active ? 'view active' : 'view'} id="view-morning">
      <div className="prompt-bubble">
        رسالة من مالك البوت تصلك كل صباح. الرسالتان تتناوبان يوماً بعد يوم، فلا تصلك الرسالة نفسها يومين متتاليين
        أبداً.
      </div>
      <div className="switch-row">
        <span className="lbl">
          رسالة الصباح<small>كل يوم الساعة 7:00 صباحاً</small>
        </span>
        <button
          className="switch"
          type="button"
          role="switch"
          aria-checked={morning ? 'true' : 'false'}
          onClick={onToggle}
          aria-label="تفعيل رسالة الصباح"
        />
      </div>
      {MORNING_MESSAGES.map((m) => (
        <div className="msg-card" key={m.msg}>
          <span className="msg">{m.msg}</span>
          <span className="when">{m.when}</span>
        </div>
      ))}
      <p className="hint">وقت الإرسال ثابت: الساعة 7:00 صباحاً.</p>
    </section>
  )
}

/* ---------- Message from the owner ---------- */
export function FromView({ active, onRequest }: { active: boolean; onRequest: () => void }) {
  return (
    <section className={active ? 'view active' : 'view'} id="view-from">
      <div className="prompt-bubble">
        مكتبة رسائل كتبها مالك البوت بكلماته وأسلوبه حرفياً. في كل مرة تطلب واحدة، تصلك رسالة جديدة — وبلا أي
        تكرار حتى تنتهي المكتبة كلها.
      </div>
      <div className="msg-card">
        <span className="msg">رسالة من مالك البوت</span>
        <span className="when">/message-from-owner — تُرسل فوراً في المحادثة</span>
      </div>
      <button className="save-btn" type="button" onClick={onRequest}>
        إرسال /message-from-owner إلى البوت
      </button>
      <p className="hint">يُرسل الأمر إلى البوت مباشرة داخل تيليجرام فتصلك الرسالة فوراً، أو يُنسخ إن فتحت التطبيق من المتصفح.</p>
    </section>
  )
}

/* ---------- Rules / About ---------- */
export function RulesView({ active, about }: { active: boolean; about: string }) {
  return (
    <section className={active ? 'view active' : 'view'} id="view-rules">
      <div className="form-card">
        <p className="about-text">{about}</p>
      </div>
      <div className="form-card" style={{ marginTop: 14 }}>
        <span className="field-label" style={{ fontSize: 15, color: 'var(--text)', fontWeight: 600 }}>
          قواعدي الصارمة
        </span>
        <div className="rule-row">
          <IconBan />
          <p>لا أستطيع الوصول إلى أي حساب آخر أو أي شيء يخصّه، ولا أعدّل فيه شيئاً أبداً.</p>
        </div>
        <div className="rule-row">
          <IconBan />
          <p>لا أرسل أي شيء باسمه، ولا أشارك أي معلومة عنه.</p>
        </div>
        <div className="rule-row">
          <IconShieldCheck />
          <p>بيئتك هنا مستقلة تماماً، وما تكتبه هنا خاص بك.</p>
        </div>
      </div>
    </section>
  )
}
