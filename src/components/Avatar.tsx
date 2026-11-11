import type { Avatar } from '../types'

/** Bar avatar (app header). React renders one branch only, so presence
 *  — not a display toggle — decides visibility. */
export function BarAvatar({ avatar }: { avatar: Avatar }) {
  return avatar.kind === 'img' ? (
    <img className="bar-avatar" src={avatar.src} alt="" />
  ) : (
    <span className={`bar-avatar-letter ${avatar.g}`}>{avatar.letter}</span>
  )
}

/** Profile avatar (home view). */
export function ProfileAvatar({ avatar }: { avatar: Avatar }) {
  return avatar.kind === 'img' ? (
    <img className="avatar" src={avatar.src} alt="صورة البوت" />
  ) : (
    <span className={`avatar-letter ${avatar.g}`}>{avatar.letter}</span>
  )
}
