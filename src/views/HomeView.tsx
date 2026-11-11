import { BOT_DESC } from '../data'
import type { Avatar } from '../types'
import { ProfileAvatar } from '../components/Avatar'
import {
  IconBell,
  IconBook,
  IconBulb,
  IconCheck,
  IconHeartOutline,
  IconImage,
  IconLock,
  IconPencil,
  IconSearch,
  IconType,
} from '../components/icons'

interface HomeViewProps {
  active: boolean
  name: string
  avatar: Avatar
  morning: boolean
  commandsCount: number
}

const CAPABILITIES = [
  { icon: <IconSearch />, tint: 'ic-blue', title: 'إجابة وبحث', text: 'أجيب عن أسئلتك، وأبحث لك في الويب عندما تحتاج معلومة حديثة.' },
  { icon: <IconImage />, tint: 'ic-pink', title: 'قراءة الصور والملفات', text: 'أرسل صورة أو ملفاً، فأقرأه وألخّص محتواه وأجيب عنه.' },
  { icon: <IconBook />, tint: 'ic-gold', title: 'مساعدة في الدراسة', text: 'شرح خطوة بخطوة، تلخيص الدروس، وأسئلة اختبار مع تصحيح إجاباتك.' },
  { icon: <IconPencil />, tint: 'ic-violet', title: 'رسم الصور', text: 'صف ما تتخيّله، وسأرسم لك صورة منه.' },
  { icon: <IconBell />, tint: 'ic-green', title: 'تذكيرات في وقتها', text: 'قل لي «ذكّرني بـ...» وسأرسله لك في وقته تماماً.' },
  { icon: <IconType />, tint: 'ic-blue', title: 'كتابة وترجمة', text: 'صياغة الرسائل والنصوص، وترجمة بين العربية والإنجليزية.' },
  { icon: <IconBulb />, tint: 'ic-gold', title: 'أفكار وتنظيم', text: 'خطط وقوائم وعصف ذهني — لأي مشروع أو يوم مزدحم.' },
]

export default function HomeView({ active, name, avatar, morning, commandsCount }: HomeViewProps) {
  return (
    <section className={active ? 'view active' : 'view'} id="view-main">
      <div className="profile">
        <div className="avatar-wrap">
          <ProfileAvatar avatar={avatar} />
          <span className="spark-badge" aria-hidden="true">
            <IconHeartOutline />
          </span>
        </div>
        <h1>{name}</h1>
        <div className="username">@demo_assistant_bot</div>
        <p className="desc">{BOT_DESC}</p>
      </div>

      <div className="status-card" aria-label="حالة البوت">
        <div className="row">
          <span className="k">الوصف:</span>
          <span className="v off">
            <IconLock />
            <span>ثابت — لا يُعدّل من هنا</span>
          </span>
        </div>
        <div className="row">
          <span className="k">النبذة (About):</span>
          <span className="v">
            <IconCheck />
            <span>موجودة</span>
          </span>
        </div>
        <div className="row">
          <span className="k">صورة البوت:</span>
          <span className="v">
            <IconCheck />
            <span>موجودة</span>
          </span>
        </div>
        <div className="row">
          <span className="k">الأوامر:</span>
          <span className="v">
            <IconCheck />
            <span>{commandsCount} أوامر</span>
          </span>
        </div>
        <div className="row">
          <span className="k">رسالة الصباح:</span>
          {morning ? (
            <span className="v">
              <IconCheck />
              <span>مفعّلة — 7:00 صباحاً</span>
            </span>
          ) : (
            <span className="v off">
              <span>متوقفة</span>
            </span>
          )}
        </div>
      </div>

      <h2 className="section-title">ماذا أستطيع أن أفعل؟</h2>
      <div className="cap-grid">
        {CAPABILITIES.map((cap) => (
          <div className="cap-card" key={cap.title}>
            <span className={`ic ${cap.tint}`}>{cap.icon}</span>
            <span className="t1">{cap.title}</span>
            <span className="t2">{cap.text}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
