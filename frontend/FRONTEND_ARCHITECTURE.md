# Frontend Architecture

## Pattern: Next.js App Router + Custom Hooks + Service Layer

```
Pages (app/) → Hooks (state + logic) → Services (API calls)
            → Components (UI)
```

## Folder Structure

```
frontend/src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Research (chat + sessions)
│   └── memories/page.tsx   # Memory explorer (sessions + detail + verify)
├── components/
│   ├── ui/                 # shadcn/ui primitives (Button, Card, Dialog, etc.)
│   ├── chat/               # Chat-specific (ChatMessage, ChatInput)
│   ├── memory/             # Memory-specific (MemoryCard, MemoryDetail)
│   └── layout/             # App shell (Sidebar, ThemeToggle, WalletProvider)
├── hooks/
│   ├── use-chat.ts         # Chat sessions, messages, API calls
│   └── use-memories.ts     # Memory browsing, filtering, selection
├── services/
│   ├── api.ts              # Backend API client (fetch wrapper)
│   └── mock-data.ts        # Mock data for development
├── types/                  # TypeScript interfaces
├── constants/              # App config, trust thresholds, nav items
└── lib/
    ├── utils.ts            # cn() helper
    ├── formatters.ts       # Date, hash, trust label formatters
    └── dapp-kit.ts         # Sui wallet configuration
```

## Rules

1. **Pages are thin** — they compose hooks + components, no business logic
2. **Hooks own state** — all useState/useEffect lives in hooks, not pages
3. **Services handle API** — hooks call services, never fetch directly
4. **Components are presentational** — they receive props, render UI
5. **USE_MOCK_DATA flag** — in `services/api.ts`, toggle between mock and real API

## State Management

- No Redux/Zustand — React state + hooks is sufficient
- Chat sessions persisted in `localStorage`
- Memory data fetched from backend (or mock)

## Wallet Integration

- `@mysten/dapp-kit-react` for Sui wallet connection
- Wrapped in `WalletProvider` (client-only, dynamic import with `ssr: false`)
- Connect button in sidebar footer

## Styling

- Tailwind CSS v4
- shadcn/ui components (base-ui primitives)
- Dark mode via ThemeProvider (next-themes)
- Resizable panels via `react-resizable-panels`
