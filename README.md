# Telegram Mini App — React + TypeScript (Vite)

Companion Mini App for a Telegram assistant bot: a dark, Arabic-first (RTL)
single-page app that opens inside Telegram and mirrors the bot's chat.

## Features

- **Live chat sync** — the app reads the bot's synced conversation record
  (see [Configuration](#configuration)) and refreshes it every 60 s.
- **Multiple conversations** — create, switch and delete chats from a side
  drawer; the main conversation is shared between Telegram and the app.
- **Settings** — bot name, bot picture, morning message, nickname, reply
  style, and a personal memory list the user can teach, edit or wipe.
- **Commands** — the bot's 18 commands, read-only, one tap to send or copy.
- **Study help, reminders, owner messages** — `/study` prompts, timed
  reminders, and a `/message-from-owner` message library.
- **Telegram bridge** — `sendData` payloads back to the bot, native back
  button, pairing code kept in Telegram CloudStorage (never localStorage).

## Build

```bash
npm install
npm run build   # tsc --noEmit && vite build → dist/
npm run dev     # local dev server
```

`dist/` contains `index.html` + hashed assets. The base is relative (`./`)
so the output works from any sub-path.

## Configuration

The chat-sync store is **not** bundled with this repo. Point the app at
your own backend with:

```bash
cp .env.example .env   # then edit the URL
```

| Variable | Purpose | Default |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Base URL of the sync API (`GET ?action=state&code=…`) | `https://api.example.com/api/demo` (placeholder — does nothing) |

The app only calls that public GET endpoint with the user's one-time
`/link` code. No bot token, no keys, no passwords anywhere in the code.

## Structure

```
index.html            # RTL, fonts, telegram-web-app.js, #root
vite.config.ts        # React plugin, relative base, dist/
src/
  main.tsx            # createRoot
  index.css           # full stylesheet
  types.ts            # ViewId, Avatar, Conversation, BotPayload, …
  data.ts             # about text, 18 commands, titles, picture options
  telegram.ts         # WebApp bridge (sendData, CloudStorage), clipboard
  store.ts            # shared-store fetch + tolerant normalizer
  reducer.ts          # app state + pure reducer + welcome messages
  components/
    icons.tsx         # all SVG paths, collected once
    Avatar.tsx        # bar + profile avatar (img or letter)
    Drawer.tsx        # conversations side drawer
    ChatPanel.tsx     # conversation header + chat log + form
    Toast.tsx
  views/
    HomeView.tsx      # profile, status card, capabilities
    ChatView.tsx      # link card + chat
    OrdersView.tsx    # 18 commands, read-only
    SpaceView.tsx     # the nine «مساحتي» rows
    SubViews.tsx      # name, about (view-only), bot picture, morning,
                      # message from the owner, rules
    StudyView.tsx
    RemindersView.tsx
    MemoryView.tsx
  assets/             # bot avatar + 3 picture options (inlined as data URIs)
```

## Notes

- Strict TypeScript (`tsc --noEmit` passes with `noUnusedLocals` /
  `noUnusedParameters`).
- One reducer holds all app state; side effects (Telegram bridge, store
  sync, timers) live in `App.tsx`; pure helpers live in `store.ts` /
  `reducer.ts`.
- Images are inlined as data URIs (`?inline` imports), so the
  `set_botpic` `sendData` payload carries the full image.
- Outside Telegram the app still works as a browser preview: commands are
  copied instead of sent, and the close button explains itself.
