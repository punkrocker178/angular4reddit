# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Dev server on 0.0.0.0 (hot reload)
npm run build      # Production build (esbuild)
npm test           # Unit tests via Karma + Jasmine
npm run lint       # Angular ESLint
npm run e2e        # End-to-end tests via Protractor
```

To run a single test file, use:
```bash
npx ng test --include='**/path/to/file.spec.ts'
```

## Architecture

**Stack**: Angular 18, NgModule-based (not standalone), LESS stylesheets, Bootstrap, RxJS 7

### Routing

Defined in `src/app/app-routing.module.ts`. Lazy-loaded modules: `/r` → `SubredditModule`, `/u` → `UserModule`, `/search` → `SearchModule`. A `CustomReuseStrategy` (in `src/app/routing.ts`) detaches and reattaches route components for `home` and `:subreddit` routes to preserve scroll and feed state.

### State Management

No NgRx. State lives in services as **RxJS BehaviorSubjects**. `RedditListingService` owns the post feed state via `listingSubject`. LocalStorage (via `LocalStorageService`) persists tokens, theme, and preferences across sessions.

### Auth Flow

Reddit OAuth2 — `RedditAuthenticateService` manages access tokens. `HttpConfigInterceptor` (`src/app/interceptor/`) attaches JWT tokens, detects expiration (3599s), queues requests during refresh, and handles 401/404 errors automatically.

### Key Services

| Service | Responsibility |
|---|---|
| `RedditListingService` | Fetch/cache posts, pagination |
| `RedditAuthenticateService` | OAuth2 flow, token refresh |
| `UserService` | User profile, NSFW prefs |
| `VotingService` | Up/downvote posts and comments |
| `SubredditService` | Subscribe/unsubscribe |
| `ThemeService` | Dark/light theme state |
| `ToastService` | Toast notification system |

### Module Structure

```
src/app/
├── class/         # Utility classes (Utils, HeadersUtils)
├── components/    # All UI components (feature-based)
├── config/        # App configuration
├── constants/     # API base URLs and domain constants
├── directives/    # ParseHtmlDirective for HTML rendering
├── interceptor/   # HttpConfigInterceptor
├── model/         # TypeScript interfaces (Post, User, Listings, etc.)
├── pipe/          # SafePipe, DateTimePipe, DomParserPipe, etc.
├── services/      # All injectable services
├── shared/        # ScrollToTopButton, ToggleButton, TrumbowygComponent
└── routing.ts     # CustomReuseStrategy
```

### Key Dependencies

- `@ng-bootstrap/ng-bootstrap` — UI components (modals, dropdowns, toasts)
- `ngx-infinite-scroll` — Infinite scroll on feed
- `@rx-angular/template` — `RxFor` directive for performant list rendering
- `hls.js` / `dashjs` — HLS and DASH video streaming
- `luxon` — Date/time formatting
- `turndown` — HTML-to-Markdown for post bodies
- `trumbowyg` — WYSIWYG editor for comment/post submission
