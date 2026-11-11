import type { ViewId } from '../types'
import {
  IconBell,
  IconBook,
  IconChevron,
  IconHeartOutline,
  IconImage,
  IconInfo,
  IconLock,
  IconPen,
  IconShieldCheck,
  IconSun,
  IconUser,
} from '../components/icons'

interface SpaceViewProps {
  active: boolean
  remindersCount: number
  onGo: (view: ViewId) => void
}

interface SpaceRow {
  target: ViewId
  tint: string
  icon: React.ReactNode
  title: string
  sub: string
  badge?: number
}

export default function SpaceView({ active, remindersCount, onGo }: SpaceViewProps) {
  const rows: SpaceRow[] = [
    { target: 'view-name', tint: 'ic-blue', icon: <IconPen />, title: 'تعديل الاسم', sub: 'اسم البوت الذي يظهر في الأعلى' },
    { target: 'view-botpic', tint: 'ic-pink', icon: <IconImage />, title: 'تغيير الصورة', sub: 'صورة البوت في الأعلى وفي المحادثة' },
    { target: 'view-about', tint: 'ic-gold', icon: <IconInfo />, title: 'النبذة', sub: 'للاطّلاع فقط — كما ضبطها مالك البوت' },
    { target: 'view-morning', tint: 'ic-violet', icon: <IconSun />, title: 'رسالة الصباح', sub: 'رسالة من مالك البوت كل يوم 7:00 صباحاً' },
    { target: 'view-from', tint: 'ic-pink', icon: <IconHeartOutline sw={2} />, title: 'رسالة من مالك البوت', sub: '/message-from-owner — رسالة من مكتبة كتبها مالك البوت بكلماته' },
    { target: 'view-study', tint: 'ic-blue', icon: <IconBook />, title: 'ساعدني في الدراسة', sub: '/study — شرح خطوة بخطوة، تلخيص، وأسئلة اختبار' },
    { target: 'view-reminders', tint: 'ic-pink', icon: <IconBell />, title: 'تذكيراتي', sub: '/remind — أرسلها لك في وقتها', badge: remindersCount },
    { target: 'view-memory', tint: 'ic-violet', icon: <IconUser />, title: 'ما يعرفه البوت عني', sub: 'علّمني عنك، وعدّل أو امسح في أي وقت' },
    { target: 'view-rules', tint: 'ic-green', icon: <IconShieldCheck />, title: 'القواعد والخصوصية', sub: 'حدود صارمة وبيئة مستقلة تماماً' },
  ]

  return (
    <section className={active ? 'view active' : 'view'} id="view-space">
      <h2 className="section-title">كل شيء في مكان واحد</h2>
      <div className="list-card">
        {rows.map((row) => (
          <button key={row.target} className="list-row" type="button" onClick={() => onGo(row.target)}>
            <span className={`ic ${row.tint}`}>{row.icon}</span>
            <span className="tt">
              <span className="t1">{row.title}</span>
              <span className="t2">{row.sub}</span>
            </span>
            {row.badge !== undefined && (
              <span className="badge" style={{ display: row.badge ? 'inline-flex' : 'none' }}>
                {row.badge}
              </span>
            )}
            <span className="chev">
              <IconChevron />
            </span>
          </button>
        ))}
      </div>
      <p className="lock-note">
        <IconLock />
        <span>
          وصف البوت ونبذته وقائمة أوامره ثابتة كما ضبطها مالك البوت، وتُعرض للاطّلاع فقط — قائمة الأوامر نفسها في
          تبويب «أوامري».
        </span>
      </p>
    </section>
  )
}
