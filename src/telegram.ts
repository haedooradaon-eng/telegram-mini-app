import type { BotPayload } from './types'

export interface TelegramCloudStorage {
  setItem(key: string, value: string): void
  getItem(key: string, callback: (err: unknown, value?: string) => void): void
  removeItem(key: string): void
}

export interface TelegramBackButton {
  show(): void
  hide(): void
  onClick(callback: () => void): void
  offClick(callback: () => void): void
  isVisible: boolean
}

export interface TelegramWebApp {
  ready(): void
  expand(): void
  close(): void
  sendData(data: string): void
  BackButton?: TelegramBackButton
  CloudStorage?: TelegramCloudStorage
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp }
  }
}

export function getTelegram(): TelegramWebApp | null {
  return window.Telegram?.WebApp ?? null
}

export function initTelegram(): void {
  const tg = getTelegram()
  if (!tg) return
  try {
    tg.ready()
    tg.expand()
  } catch {
    // Outside Telegram — the app still works as a browser preview.
  }
}

/** Shows or hides Telegram's native back button. No-op outside Telegram. */
export function setTelegramBackButtonVisible(visible: boolean): void {
  const bb = getTelegram()?.BackButton
  if (!bb) return
  try {
    if (visible) bb.show()
    else bb.hide()
  } catch {
    // Outside Telegram — the app still works as a browser preview.
  }
}

/**
 * Registers a handler for Telegram's back button. Inside Telegram the
 * Android system back button fires this same event when the button is
 * visible, and closes the app when it is hidden. Returns an unsubscribe
 * function. No-op outside Telegram.
 */
export function onTelegramBackButton(callback: () => void): () => void {
  const bb = getTelegram()?.BackButton
  if (!bb) return () => {}
  try {
    bb.onClick(callback)
  } catch {
    return () => {}
  }
  return () => {
    try {
      bb.offClick(callback)
    } catch {
      // Ignore.
    }
  }
}

/** Sends a JSON payload to the bot. Returns false outside Telegram. */
export function sendToBot(payload: BotPayload): boolean {
  const tg = getTelegram()
  if (!tg) return false
  try {
    tg.sendData(JSON.stringify(payload))
    return true
  } catch {
    return false
  }
}

/** Sends a text command to the bot, or copies it when opened in a browser. */
export function sendOrCopy(text: string, okMsg: string, toast: (msg: string) => void): void {
  if (sendToBot({ type: 'message', text })) {
    toast('أُرسل إلى البوت: ' + text)
  } else {
    copyText(text, okMsg, toast)
  }
}

export function copyText(text: string, okMsg: string, toast: (msg: string) => void): void {
  const done = () => toast(okMsg)
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(done, () => fallbackCopy(text, done, toast))
  } else {
    fallbackCopy(text, done, toast)
  }
}

function fallbackCopy(text: string, done: () => void, toast: (msg: string) => void): void {
  const ta = document.createElement('textarea')
  ta.value = text
  ta.style.position = 'fixed'
  ta.style.opacity = '0'
  document.body.appendChild(ta)
  ta.select()
  try {
    document.execCommand('copy')
    done()
  } catch {
    toast('تعذّر النسخ')
  }
  document.body.removeChild(ta)
}

/** The pairing code lives in Telegram CloudStorage (the user's account
 *  storage), never in localStorage and never in this page. */
export const LINK_CODE_KEY = 'telegram_link_code'

export function saveLinkCode(code: string): void {
  try {
    getTelegram()?.CloudStorage?.setItem(LINK_CODE_KEY, code)
  } catch {
    // Storage failure must not break linking.
  }
}

export function clearLinkCode(): void {
  try {
    getTelegram()?.CloudStorage?.removeItem(LINK_CODE_KEY)
  } catch {
    // Ignore.
  }
}

export function loadLinkCode(callback: (code: string) => void): void {
  const tg = getTelegram()
  if (!tg?.CloudStorage?.getItem) return
  try {
    tg.CloudStorage.getItem(LINK_CODE_KEY, (err, val) => {
      if (!err && val) callback(val)
    })
  } catch {
    // Ignore.
  }
}
