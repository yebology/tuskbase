# Frontend Architecture

## Pattern: Next.js App Router + Custom Hooks + Service Layer

```
Page (app/page.tsx) → Hooks (state + logic) → Services (API calls)
                   → Components (UI)
```

## Single Page App

Tuskbase frontend is a single-page application. No routing — everything lives on `/`.

## Folder Structure

```
frontend/src/
├── app/
│   ├── page.tsx            # Main page (header + sessions + chat + PDF download)
│   ├── layout.tsx          # Root layout (providers, fonts)
│   └── globals.css         # Tailwind + theme variables
├── components/
│   ├── ui/                 # shadcn/ui primitives (Button, Card, Dialog, etc.)
│   ├── chat/               # ChatMessage (markdown + report download), ChatInput
│   └── layout/             # ThemeToggle, ConnectWallet, ThemeProvider, AppProviders
├── hooks/
│   └── use-chat.ts         # Chat sessions, messages, API calls, localStorage
├── services/
│   └── api.ts              # Backend API client (research, recall, verify, health)
├── types/                  # TypeScript interfaces (Memory, ResearchReport, ChatMessage)
├── constants/              # App config, trust thresholds, nav items
└── lib/
    ├── utils.ts            # cn() helper
    ├── formatters.ts       # Date, hash, trust label formatters
    └── dapp-kit.ts         # Sui wallet configuration
```

## Layout Structure

```
┌─────────────────────────────────────────────────────┐
│  Header (branding + Sui Devnet + wallet + theme)     │
├──────────┬──────────────────────────────────────────┤
│ Sessions │                                           │
│ (toggle) │         Chat Area                         │
│          │   (messages + PDF download button)        │
│ + New    │                                           │
│ session1 │                                           │
│ session2 │         ─────────────────────             │
│          │         Chat Input                        │
└──────────┴──────────────────────────────────────────┘
```

## Rules

1. **Single page** — no routing, everything on `/`
2. **Hooks own state** — all useState/useEffect lives in hooks
3. **Services handle API** — hooks call services, never fetch directly
4. **Components are presentational** — receive props, render UI
5. **Session sidebar is collapsible** — toggle via header button

## State Management

- No Redux/Zustand — React state + hooks
- Chat sessions persisted in `localStorage`
- Research results (summary + report metadata) stored in session messages

## Chat Message Types

Messages can have:
- `content` — markdown text (summary)
- `report` — ResearchReport metadata (blobId, hash, txDigest, sourceCount, factCount, downloadUrl)

When `report` is present, a download button is rendered below the summary.

## PDF Download Flow

1. User clicks "Download Research Report (PDF)"
2. Frontend fetches blob from Walrus aggregator URL
3. Creates a Blob with `application/pdf` content type
4. Triggers browser download as `.pdf` file

This is needed because Walrus doesn't set Content-Type headers.

## Wallet Integration

- `@mysten/dapp-kit-react` for Sui wallet connection
- Wrapped in `AppProviders` (client-only)
- Connect button in header

## Styling

- Tailwind CSS v4
- shadcn/ui components
- Dark mode via ThemeProvider (next-themes)
- Responsive — sidebar hidden on mobile, collapsible on desktop
