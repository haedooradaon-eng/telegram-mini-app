import type { ReactNode } from 'react'

/** All icons are the exact SVG paths, collected here once so no
 *  view repeats an inline path. Sizes come from the stylesheet, as before. */

function Svg({
  sw = 2,
  fill,
  children,
}: {
  sw?: number
  fill?: string
  children: ReactNode
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={fill ?? 'none'}
      stroke={fill ? 'none' : 'currentColor'}
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  )
}

const HEART_PATH =
  'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z'

export function IconMenu() {
  return (
    <Svg>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </Svg>
  )
}

export function IconCloseSmall() {
  return (
    <Svg>
      <path d="M1 1l12 12M13 1L1 13" />
    </Svg>
  )
}

export function IconClose() {
  return (
    <Svg>
      <path d="M6 6l12 12M18 6L6 18" />
    </Svg>
  )
}

export function IconBack() {
  return (
    <Svg sw={2.4}>
      <path d="M9 5l7 7-7 7" />
    </Svg>
  )
}

export function IconHeartOutline({ sw = 2.6 }: { sw?: number }) {
  return (
    <Svg sw={sw}>
      <path d={HEART_PATH} />
    </Svg>
  )
}

export function IconHeartFill() {
  return (
    <Svg fill="currentColor">
      <path d={HEART_PATH} />
    </Svg>
  )
}

export function IconUser() {
  return (
    <Svg>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
    </Svg>
  )
}

export function IconChevron() {
  return (
    <Svg sw={2.2}>
      <path d="M15 5l-7 7 7 7" />
    </Svg>
  )
}

export function IconSearch() {
  return (
    <Svg>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.8-3.8" />
    </Svg>
  )
}

export function IconImage() {
  return (
    <Svg>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="9" cy="9" r="2" />
      <path d="M21 15l-5-5L5 21" />
    </Svg>
  )
}

export function IconBook() {
  return (
    <Svg>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5v13z" />
      <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" />
    </Svg>
  )
}

export function IconPencil() {
  return (
    <Svg>
      <path d="M12 19l7-7 3 3-7 7-3-3z" />
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      <path d="M2 2l7.6 7.6" />
      <circle cx="11" cy="11" r="2" />
    </Svg>
  )
}

export function IconBell() {
  return (
    <Svg>
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8" />
      <path d="M13.7 20a2 2 0 0 1-3.4 0" />
    </Svg>
  )
}

export function IconType() {
  return (
    <Svg>
      <path d="M4 7V5h16v2" />
      <path d="M9 20h6" />
      <path d="M12 5v15" />
    </Svg>
  )
}

export function IconBulb() {
  return (
    <Svg>
      <path d="M9 18h6" />
      <path d="M10 21h4" />
      <path d="M12 3a6 6 0 0 0-4 10.5c.8.7 1 1.5 1 2.5h6c0-1 .2-1.8 1-2.5A6 6 0 0 0 12 3z" />
    </Svg>
  )
}

export function IconHome() {
  return (
    <Svg>
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9.5 21v-6h5v6" />
    </Svg>
  )
}

export function IconChat() {
  return (
    <Svg>
      <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.5 0-3-.4-4.2-1.1L3 20l1.1-5.3A8.5 8.5 0 1 1 21 11.5z" />
    </Svg>
  )
}

export function IconList() {
  return (
    <Svg>
      <path d="M8.5 6H21M8.5 12H21M8.5 18H21" />
      <path d="M3.5 6h.01M3.5 12h.01M3.5 18h.01" />
    </Svg>
  )
}

export function IconLock() {
  return (
    <Svg>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </Svg>
  )
}

export function IconSend() {
  return (
    <Svg>
      <path d="M22 2L11 13" />
      <path d="M22 2l-7 20-4-9-9-4 20-7z" />
    </Svg>
  )
}

export function IconTrash() {
  return (
    <Svg>
      <path d="M3 6h18" />
      <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    </Svg>
  )
}

export function IconCheck() {
  return (
    <Svg sw={2.4}>
      <path d="M20 6L9 17l-5-5" />
    </Svg>
  )
}

export function IconInfo() {
  return (
    <Svg>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </Svg>
  )
}

export function IconSun() {
  return (
    <Svg>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </Svg>
  )
}

export function IconPen() {
  return (
    <Svg>
      <path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </Svg>
  )
}

export function IconShieldCheck() {
  return (
    <Svg>
      <path d="M12 22s8-3.6 8-10V5l-8-3-8 3v7c0 6.4 8 10 8 10z" />
      <path d="M9 11.5l2 2 4-4.5" />
    </Svg>
  )
}

export function IconBan() {
  return (
    <Svg>
      <circle cx="12" cy="12" r="9" />
      <path d="M5.5 5.5l13 13" />
    </Svg>
  )
}

export function IconFile() {
  return (
    <Svg>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M9 13h6M9 17h4" />
    </Svg>
  )
}

export function IconQuiz() {
  return (
    <Svg>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.3a2.6 2.6 0 1 1 3.4 2.5c-.8.25-.9.7-.9 1.4" />
      <path d="M12 17h.01" />
    </Svg>
  )
}
