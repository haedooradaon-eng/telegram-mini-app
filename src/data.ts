import type { Avatar, BotCommand, StudyMode, ViewId } from './types'

// Images are inlined as data URIs (they were embedded as base64 in the
// single HTML file). This keeps `avatar.src` — and therefore the
// `set_botpic` sendData payload — byte-identical.
import botAvatarSrc from './assets/bot.svg?inline'
import picBooksSrc from './assets/pic-books.svg?inline'
import picMoonSrc from './assets/pic-moon.svg?inline'
import picCoffeeSrc from './assets/pic-coffee.svg?inline'

export const BOT_AVATAR_SRC = botAvatarSrc

export const ABOUT_DEFAULT =
  'أنا ذكاء اصطناعي، اسمي Muse 💬\n\n' +
  'أنا مساعد تيليجرام يعمل داخل تطبيق مصغّر: أجيب عن الأسئلة، وأبحث في الويب، وأقرأ الصور والملفات، وأرسم الصور، وأساعد في الدراسة.\n\n' +
  'هذه مساحتك الخاصة:\n' +
  '• ما تكتبه هنا خاص بك، ولا يُرسل لأي شخص آخر.\n' +
  '• تستطيع أن تعلّمني عنك، وأن تغيّر ما أعرفه عنك أو تمسحه في أي وقت.\n' +
  '• تستطيع أن تغيّر الاسم الذي أناديك به، وأسلوب ردودي، وحتى اسم البوت وصورته.\n\n' +
  'قواعدي:\n' +
  '• لا أصل إلى أي حساب آخر ولا أعدّل فيه شيئاً أبداً.\n' +
  '• لا أرسل أي شيء باسم أحد، ولا أشارك أي معلومة عن أي شخص.\n' +
  '• بيئتك هنا مستقلة تماماً.\n\n' +
  'اسألني كما تشاء 💬'

export const BOT_NAME_DEFAULT = 'مساعد تيليجرام'

export const BOT_DESC =
  'أنا Muse، ذكاء اصطناعي يعمل داخل تيليجرام. أجيب عن الأسئلة، وأبحث في الويب، وأقرأ الصور والملفات، وأرسم الصور، وأساعد في الدراسة.'

/** The 18 commands — read-only in the app. */
export const COMMANDS: BotCommand[] = [
  { cmd: 'start', desc: 'ابدأ المحادثة من جديد' },
  { cmd: 'help', desc: 'كل ما أستطيع فعله' },
  { cmd: 'about', desc: 'من أنا؟' },
  { cmd: 'message-from-owner', desc: 'رسالة من مالك البوت' },
  { cmd: 'remember', desc: 'علّم البوت معلومة عنك ليحفظها' },
  { cmd: 'forget', desc: 'احذف معلومة محفوظة' },
  { cmd: 'profile', desc: 'ماذا يعرف البوت عنك؟' },
  { cmd: 'clear', desc: 'امسح سياقي المحفوظ' },
  { cmd: 'search', desc: 'ابحث في الويب' },
  { cmd: 'summarize', desc: 'لخّص نصاً أو رابطاً' },
  { cmd: 'draw', desc: 'ارسم صورة من وصفك' },
  { cmd: 'remind', desc: 'ذكّرني بشيء في وقته' },
  { cmd: 'study', desc: 'ساعدني في الدراسة' },
  { cmd: 'newchat', desc: 'أنشئ محادثة جديدة باسم تختاره' },
  { cmd: 'chats', desc: 'اعرض كل محادثاتك' },
  { cmd: 'switch', desc: 'انتقل إلى محادثة أخرى' },
  { cmd: 'delchat', desc: 'احذف محادثة' },
  { cmd: 'link', desc: 'رمز ربط التطبيق المصغّر بسجلّ محادثاتك' },
]

export const TITLES: Record<ViewId, string> = {
  'view-main': 'الرئيسية',
  'view-chat': 'المحادثة الرئيسية',
  'view-orders': 'أوامري',
  'view-space': 'مساحتي',
  'view-name': 'تعديل الاسم',
  'view-about': 'النبذة',
  'view-botpic': 'صورة البوت',
  'view-morning': 'رسالة الصباح',
  'view-from': 'رسالة من مالك البوت',
  'view-study': 'ساعدني في الدراسة',
  'view-reminders': 'تذكيراتي',
  'view-memory': 'ما يعرفه البوت عني',
  'view-rules': 'القواعد والخصوصية',
}

/** Parent view for the back button (sub-views only). */
export const PARENT: Partial<Record<ViewId, ViewId>> = {
  'view-space': 'view-main',
  'view-name': 'view-space',
  'view-about': 'view-space',
  'view-botpic': 'view-space',
  'view-morning': 'view-space',
  'view-from': 'view-space',
  'view-study': 'view-space',
  'view-reminders': 'view-space',
  'view-memory': 'view-space',
  'view-rules': 'view-space',
}

export const TAB_VIEWS: ViewId[] = ['view-main', 'view-chat', 'view-orders']

export const MORNING_MESSAGES: { msg: string; when: string }[] = [
  { msg: 'صباح الخير 🌞', when: 'تُرسل في اليوم الأول' },
  { msg: 'صباح النور ☀️', when: 'تُرسل في اليوم التالي، ثم تتناوبان' },
]

export const STUDY_PREFIXES: Record<StudyMode, string> = {
  explain: '/study اشرح لي خطوة بخطوة: ',
  summary: '/study لخّص لي: ',
  quiz: '/study ضع لي أسئلة اختبار وصحّح إجاباتي عن: ',
}

export const REMINDER_PRESETS = ['بعد ساعة', 'بعد ٣ ساعات', 'غداً ٧:٠٠ صباحاً']

export const STYLE_OPTIONS = ['الفصحى', 'مختصر ومباشر', 'مفصّل وهادئ']

export interface PicOption {
  key: string
  label: string
  alt: string
  avatar: Avatar
}

export const PIC_OPTIONS: PicOption[] = [
  { key: 'current', label: 'الصورة الحالية للبوت', alt: 'الصورة الحالية للبوت', avatar: { kind: 'img', src: botAvatarSrc } },
  { key: 'books', label: 'صورة الكتب', alt: 'صورة مرسومة لكتب مكدّسة', avatar: { kind: 'img', src: picBooksSrc } },
  { key: 'moon', label: 'صورة الهلال والقلب', alt: 'صورة مرسومة لهلال ونجوم وقلب وردي', avatar: { kind: 'img', src: picMoonSrc } },
  { key: 'coffee', label: 'صورة الكتاب والقهوة', alt: 'صورة مرسومة لكتاب مفتوح وفنجان قهوة', avatar: { kind: 'img', src: picCoffeeSrc } },
  { key: 'letter-g1', label: 'حرف ميم وردي', alt: '', avatar: { kind: 'letter', letter: 'م', g: 'g1' } },
  { key: 'letter-g2', label: 'حرف ميم أزرق', alt: '', avatar: { kind: 'letter', letter: 'م', g: 'g2' } },
  { key: 'letter-g3', label: 'حرف ميم ذهبي', alt: '', avatar: { kind: 'letter', letter: 'م', g: 'g3' } },
]

/** An image option matches by its data URI,
 *  a letter option matches by its gradient class. */
export function isPicSelected(option: PicOption, avatar: Avatar): boolean {
  if (avatar.kind === 'img') {
    return option.avatar.kind === 'img' && option.avatar.src === avatar.src
  }
  return (
    option.avatar.kind === 'letter' &&
    option.avatar.g === avatar.g
  )
}
