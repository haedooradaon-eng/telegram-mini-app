import { COMMANDS } from '../data'
import { IconLock, IconSend } from '../components/icons'

interface OrdersViewProps {
  active: boolean
  onCommand: (cmd: string) => void
}

export default function OrdersView({ active, onCommand }: OrdersViewProps) {
  return (
    <section className={active ? 'view active' : 'view'} id="view-orders">
      <h2 className="section-title">الأوامر المتفق عليها</h2>
      <div className="list-card">
        {COMMANDS.map((c) => (
          <button key={c.cmd} type="button" className="list-row" onClick={() => onCommand(c.cmd)}>
            <span className="ic ic-blue">
              <IconSend />
            </span>
            <span className="tt">
              <span className="t1">{c.desc}</span>
              <span className="t2">/{c.cmd}</span>
            </span>
            <span className="chev">
              <IconSend />
            </span>
          </button>
        ))}
      </div>
      <p className="hint">
        هذه هي الأوامر الموصّلة في البوت. اضغط أي أمر فيُرسل إلى البوت مباشرة داخل تيليجرام، أو يُنسخ إن
        فتحت التطبيق من المتصفح.
      </p>
      <p className="lock-note">
        <IconLock />
        <span>قائمة الأوامر ثابتة كما ضبطها مالك البوت، وتُعرض هنا للاطّلاع والاستعمال فقط.</span>
      </p>
    </section>
  )
}
