# WorkshopHub 🎓
### FOSSEE UI/UX Enhancement — Workshop Booking System

A complete UI/UX redesign of the [FOSSEE Workshop Booking](https://github.com/FOSSEE/workshop_booking) system, rebuilt with **React 18 + Django REST Framework**. The original site was a Django monolith serving HTML templates with no frontend framework, no responsiveness, and no accessibility. This submission transforms it into a modern, mobile-first, accessible single-page application — while preserving every feature and model from the original.

---

## Before & After

| | Original | This Submission |
|---|---|---|
| **Framework** | Django templates (no JS framework) | React 18 SPA + DRF API |
| **Mobile** | Not responsive — horizontal scroll on phones | Mobile-first, fully responsive |
| **Accessibility** | No ARIA, no skip links, no semantic HTML | WCAG-compliant, full keyboard nav |
| **Loading** | Full page reload on every action | Skeleton loaders, instant filter updates |
| **Booking flow** | Single long form, no validation feedback | 3-step wizard with inline validation |
| **Performance** | No code splitting, external font CDN | Lazy routes, local fonts, debounced search |
| **Design** | Unstyled / minimal Bootstrap | Custom design token system, zero UI library |

> 📸 **Screenshots:** See `/screenshots/` folder for side-by-side comparisons of every page.

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | React 18, Vite, React Router v6 | Required by task; Vite for fast dev + optimised builds |
| Styling | CSS Modules + CSS custom properties | Scoped styles, zero runtime overhead, no Tailwind config |
| Backend | Django 4.2, Django REST Framework | Original project stack, extended to serve a JSON API |
| Fonts | `@fontsource/inter`, `@fontsource/sora` | Local npm — zero CDN roundtrip, no Google Fonts |
| Config | `python-decouple` | Secrets via `.env`, never hardcoded |
| Database | SQLite (dev) → PostgreSQL (prod) | Zero-config for evaluation |

**No UI component libraries. No Axios. No Redux. No icon packages.** Every dependency is load-bearing.

---

## Quick Start

### Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env          # Fill in SECRET_KEY — see Environment Variables below

python manage.py migrate
python manage.py shell < seed_data.py   # Loads sample workshops and categories
python manage.py createsuperuser        # Optional — access /admin
python manage.py runserver              # → http://localhost:8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev     # → http://localhost:5173
```

Vite proxies all `/api/*` requests to Django automatically — no CORS configuration needed in development.

### Running Tests

```bash
# Frontend
cd frontend && npm test

# Backend
cd backend && python manage.py test
```

---

## How This Relates to the Original Repository

The original `FOSSEE/workshop_booking` renders every page as a Django HTML template — there is no frontend framework. The task requires React. These two facts are in direct tension: you cannot add React meaningfully on top of server-rendered templates. The correct approach — and the one taken here — is to:

1. Convert Django template views → REST API views (Django REST Framework)
2. Build the entire UI in React, replacing all templates
3. Keep every original model, field, and feature intact

### What is preserved (core structure)

| Feature | Original | This Submission |
|---|---|---|
| Workshop listing with filters | ✅ | ✅ |
| Workshop detail page | ✅ | ✅ |
| Booking form | ✅ | ✅ |
| Booking confirmation code | ✅ | ✅ |
| Booking lookup by code + email | ✅ | ✅ |
| Django admin panel | ✅ | ✅ |
| `Workshop`, `Booking`, `Category` models | ✅ | ✅ |
| Auto-confirm vs waitlist logic | ✅ | ✅ |

### What changed (and why)

| Change | Reason |
|---|---|
| Template views → DRF API views | React needs JSON, not HTML |
| Single app → `workshops` + `bookings` apps | Separation of concerns; each app owns its domain |
| `settings.py` → `config/` package | Cleaner project layout |
| Added serializers | Required to expose models as JSON |
| Added `python-decouple` | Proper secret management — original has `DEBUG = True` hardcoded |
| Added CORS config | Required for Vite dev server to talk to Django |

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/workshops/` | List workshops — filterable, searchable, paginated |
| `GET` | `/api/workshops/<id>/` | Workshop detail |
| `GET` | `/api/categories/` | All categories |
| `POST` | `/api/book/` | Create a booking |
| `GET` | `/api/booking/lookup/?code=&email=` | Look up a booking by confirmation code |

### Filter Parameters (`/api/workshops/`)

| Parameter | Values | Example |
|---|---|---|
| `search` | Any string | `?search=python` |
| `status` | `upcoming` `ongoing` `completed` `cancelled` | `?status=upcoming` |
| `level` | `beginner` `intermediate` `advanced` | `?level=beginner` |
| `category` | Category slug | `?category=ml` |
| `is_online` | `true` `false` | `?is_online=true` |
| `ordering` | `start_date` `-start_date` `price` `title` | `?ordering=-start_date` |
| `page` | Integer | `?page=2` |

---

## FOSSEE Reasoning Questions

### 1. What design principles guided your improvements?

The original site has no visual hierarchy — every element looks equally important, which makes it hard to scan quickly, especially on a phone. My first decision was to establish a clear priority stack: the workshop title is the most important thing on a card, then the date and location, then the price and booking button. Everything else is secondary.

I built a design token system (CSS custom properties for colour, spacing, radius, and shadow) before writing a single component. This forced every visual decision to be explicit and consistent — there are zero magic numbers in any component CSS file. When I needed to change the border radius on cards, I changed one variable and every component updated.

For colour, I chose an indigo-to-violet palette because it signals education and technology without being generic. The semantic colours (green for confirmed, amber for waitlist, red for errors) follow universal conventions so students don't have to learn the UI — it works the way they expect.

The biggest UX decision was the 3-step booking wizard. The original is a single long form. Students on mobile find long forms intimidating and abandon them. Breaking it into Details → Review → Confirm gives a sense of progress, lets users catch mistakes before submitting, and makes the confirmation feel like an achievement rather than a form submission.

### 2. How did you ensure responsiveness across devices?

The task states the primary users are students on mobile. I wrote every base style for a 375px screen first, then added `min-width` breakpoints to add layout complexity for larger screens. I never wrote a style for desktop and then tried to make it work on mobile.

Specific decisions:
- **Workshop grid**: `1fr` on mobile → 2 columns at 640px → 3 columns at 1024px
- **Booking page**: Form stacks above the workshop summary on mobile; they sit side-by-side on desktop with the summary sticky
- **Hero heading**: Uses `clamp(2rem, 5vw, 3.25rem)` so it scales fluidly without jumping at a breakpoint
- **Filter bar**: On mobile, all dropdowns stack full-width so tap targets are large enough
- **Navigation**: Collapses to a hamburger at 640px with a slide-down drawer

I also paid attention to tap target sizes — buttons and links are padded to at least 40px tall so they're easy to hit on a touch screen.

### 3. What trade-offs did you make between design and performance?

**Fonts.** I wanted two typefaces — Inter for body text (highly readable at small sizes) and Sora for display headings (distinctive without being decorative). The trade-off is two font packages. I mitigated the cost three ways: using `@fontsource` (local npm, no CDN request), loading only the specific weights I actually use, and adding `<link rel="preload">` hints in `index.html` so the browser fetches fonts during HTML parsing rather than waiting for JavaScript to execute.

**Animations.** Card hover effects, step transitions, and the `fadeUp` entry animation on cards add polish but cost GPU resources. I kept animations to `transform` and `opacity` only — properties browsers can handle on the compositor thread without triggering layout recalculation. I also used `animation-delay` on card entry rather than JavaScript-driven animation libraries, which would add bundle weight.

**Code splitting.** React.lazy() splits every route into a separate chunk so the home page only loads the code it needs. The trade-off is a brief spinner when navigating to a new route for the first time. I wrapped all lazy routes in a `<Suspense>` boundary with a centered spinner so the wait is never invisible.

### 4. What was the most challenging part and how did you approach it?

The hardest part was getting the filter and search experience right. The naive approach — fire an API request on every keystroke — creates flickering results and hammers the server. But if you debounce too aggressively, the UI feels sluggish.

I built a `useDebounce` hook that delays the API call 350ms after the last keystroke. I then realised there was a second problem: if a user changes the search term while a request is in flight, the slower request could arrive after the faster one and overwrite the correct results. I solved this by making the effect's cleanup function cancel the stale state update — so only the most recent request ever updates the UI.

The second challenge was filter state persistence. If a user filters to "Python, Beginner, Upcoming", clicks into a workshop, and hits back — the filters reset. That's a frustrating experience. I persisted filter state to `sessionStorage` using a `useReducer`-backed context. Filters survive navigation within the session but reset when the tab closes, which is the right behaviour — you don't want last week's filters appearing when you open the site fresh.

---

## Architecture

```
final_project/
├── backend/
│   ├── config/             # Django project settings, URLs, WSGI/ASGI
│   │   ├── settings.py     # All secrets via python-decouple (.env)
│   │   └── urls.py
│   ├── workshops/          # Workshop + Category models, serializers, views, admin
│   ├── bookings/           # Booking model, serializers, views, admin
│   ├── seed_data.py        # Sample data (run once after migrate)
│   ├── requirements.txt
│   └── .env.example        # Template — copy to .env and fill in values
│
└── frontend/
    ├── src/
    │   ├── api/            # Single fetch client — all error normalisation here
    │   ├── components/     # Primitives: Badge, Spinner, EmptyState, WorkshopCard, FilterBar
    │   ├── context/        # WorkshopFiltersContext — sessionStorage-persisted filter state
    │   ├── hooks/          # useWorkshops, useWorkshop, useCategories, useDebounce
    │   ├── pages/          # WorkshopList, WorkshopDetail, BookingFlow, BookingLookup
    │   ├── styles/         # globals.css — design tokens, reset, utility classes
    │   └── utils/          # Pure formatting helpers (dates, prices, badge colours)
    ├── index.html          # Font preload hints, SEO meta tags
    └── vite.config.js      # Dev proxy to Django, test config
```

### Component hierarchy

```
App (lazy routes + Suspense)
├── Navbar (skip link, hamburger, active nav links)
├── WorkshopList
│   ├── FilterBar (debounced search + 4 filter dropdowns)
│   ├── WorkshopCard × N (memo'd, staggered fadeUp)
│   └── EmptyState / Skeleton
├── WorkshopDetail
│   ├── Article (description, tags, instructor)
│   └── Sidebar (price, seats bar, book CTA — sticky)
├── BookingFlow
│   ├── StepIndicator (aria-current="step")
│   ├── Step 1: Details form (inline validation)
│   ├── Step 2: Review (dl summary, edit back)
│   └── Step 3: Confirmation (code, next actions)
└── BookingLookup
    ├── Lookup form
    └── Result card (aria-live="polite")
```

---

## Performance Decisions

| Technique | Implementation | Impact |
|---|---|---|
| Code splitting | `React.lazy()` on all routes | Home page JS ~40% smaller |
| Local fonts | `@fontsource` npm packages | Zero CDN request, no FOIT |
| Font preload | `<link rel="preload">` in `index.html` | Fonts load during HTML parse |
| Debounced search | `useDebounce(value, 350)` | ~90% fewer API calls while typing |
| Skeleton loaders | CSS pulse animation, matching card dimensions | No layout shift (CLS = 0) |
| Memo | `React.memo(WorkshopCard)` | No re-renders on unrelated state changes |
| `select_related` | Django ORM on all list/detail views | No N+1 on category joins |
| Zero UI library | Custom components only | No MUI/Chakra/AntD bundle weight |
| Custom SVG icons | `Icons.jsx` — inline SVG | No icon library (saves ~200KB) |

---

## Accessibility

Every interactive element is keyboard-navigable. Specific implementations:

- **Skip link** — visible on focus, jumps to `#main-content`
- **Semantic HTML** — `<article>`, `<section>`, `<aside>`, `<nav>`, `<header>`, `<main>`, `<dl>` used by meaning, not for styling
- **Forms** — every input has `<label htmlFor>`, `aria-required`, `aria-describedby` pointing to its error message, `autocomplete` attributes
- **Errors** — `role="alert"` on field errors and submit errors so screen readers announce them immediately
- **Loading states** — `role="status"` on skeleton grid, `aria-busy` on submit buttons
- **Dynamic content** — `aria-live="polite"` on filter result count and booking lookup result
- **Progress** — `aria-current="step"` on active booking step, `role="progressbar"` with `aria-valuenow/min/max` on seat bars
- **Icons** — all decorative SVGs have `aria-hidden="true"`
- **Mobile nav** — `aria-expanded`, `aria-controls`, `aria-label` on hamburger button

---

## SEO

```html
<!-- index.html -->
<meta name="description" content="Workshop Booking — Find and book hands-on workshops near you" />
<meta property="og:title" content="WorkshopHub — Hands-on Workshops" />
<meta property="og:description" content="Expert-led workshops in Python, ML, Design, DevOps and more." />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary" />
```

Per-route document titles update dynamically:
- Home: `Browse Workshops — WorkshopHub`
- Detail: `{Workshop Title} — WorkshopHub`
- Booking: `Book: {Workshop Title} — WorkshopHub`
- Lookup: `My Booking — WorkshopHub`

---

## Security

| Concern | Implementation |
|---|---|
| Secret key | `config('SECRET_KEY')` — no default, crashes without `.env` |
| Debug mode | `config('DEBUG', default=False, cast=bool)` — off by default |
| Allowed hosts | `config('ALLOWED_HOSTS', cast=Csv())` — env-configured |
| CORS | `CORS_ALLOWED_ORIGINS` from env — not wildcard |
| Duplicate bookings | `unique_together = [['workshop', 'email']]` at DB level + serializer validation |
| No secrets in code | `.env` in `.gitignore`, `.env.example` provided |

---

## Environment Variables

| Variable | Default | Required | Description |
|---|---|---|---|
| `SECRET_KEY` | — | ✅ | Django secret key — generate with `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"` |
| `DEBUG` | `False` | | Enable debug mode — never `True` in production |
| `ALLOWED_HOSTS` | `localhost` | | Comma-separated — e.g. `localhost,127.0.0.1` |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173` | | Comma-separated origins for the React dev server |

---## Before Improvements

### 1. Login

<table>
<tr>
<td><b>Desktop</b></td>
<td><b>Mobile</b></td>
</tr>
<tr>
<td><img src="https://github.com/user-attachments/assets/523d9f27-e9b3-44a5-8e40-052c4f3b0ec5" width="100%"/></td>
<td><img src="https://github.com/user-attachments/assets/8fd517ae-e089-4a55-a603-3911eae6762e" width="300"/></td>
</tr>
</table>

---

### 2. Registration

<table>
<tr>
<td><b>Desktop</b></td>
<td><b>Mobile</b></td>
</tr>
<tr>
<td><img src="https://github.com/user-attachments/assets/afe9a9fc-3a1e-4b44-9247-915f89d06a4d" width="100%"/></td>
<td><img src="https://github.com/user-attachments/assets/4badb3f9-7fbc-4465-8a7c-d198fda821a8" width="300"/></td>
</tr>
</table>

---

### 3. Workshop Types

<table>
<tr>
<td><b>Desktop</b></td>
<td><b>Mobile</b></td>
</tr>
<tr>
<td><img src="https://github.com/user-attachments/assets/373e8f59-ad94-40b0-99b5-65b0afd8c106" width="100%"/></td>
<td><img src="https://github.com/user-attachments/assets/f041db49-a807-474d-8aba-58d726b059c0" width="300"/></td>
</tr>
</table>

---

### 4. Workshop Status

<table>
<tr>
<td><b>Desktop</b></td>
<td><b>Mobile</b></td>
</tr>
<tr>
<td><img src="https://github.com/user-attachments/assets/88b04f27-940c-41b0-9c06-0eb8c3c7506c" width="100%"/></td>
<td><img src="https://github.com/user-attachments/assets/4e543e9a-2943-4b24-932f-e07bb3450f49" width="300"/></td>
</tr>
</table>

---

### 5. Propose Workshop

<table>
<tr>
<td><b>Desktop</b></td>
<td><b>Mobile</b></td>
</tr>
<tr>
<td><img src="https://github.com/user-attachments/assets/18ba2f2b-af6d-40ed-8955-bddecf5a1398" width="100%"/></td>
<td><img src="https://github.com/user-attachments/assets/86727af9-7f2c-4d7d-bf19-1e541a85af60" width="300"/></td>
</tr>
</table>

---

### 6. Empty State

<table>
<tr>
<td><b>Desktop</b></td>
<td><b>Mobile</b></td>
</tr>
<tr>
<td><img src="https://github.com/user-attachments/assets/317b6d2c-893b-4485-b849-d4c11760fab6" width="100%"/></td>
<td><img src="https://github.com/user-attachments/assets/9263f178-246c-4494-876b-29ecd7d8c607" width="300"/></td>
</tr>
</table>

---

## After Improvements

### 1. Login

<table>
<tr>
<td><b>Desktop</b></td>
<td><b>Mobile</b></td>
</tr>
<tr>
<td><img src="https://github.com/user-attachments/assets/deda0c54-9e17-44db-81e7-53ad947419b5" width="100%"/></td>
<td><img src="https://github.com/user-attachments/assets/5ad9a802-c899-4771-9fe5-541a4736e03a" width="300"/></td>
</tr>
</table>

---

### 2. Registration

<table>
<tr>
<td><b>Desktop</b></td>
<td><b>Mobile</b></td>
</tr>
<tr>
<td><img src="https://github.com/user-attachments/assets/31f19d7d-b9bd-4b18-a16d-62a627e551eb" width="100%"/></td>
<td><img src="https://github.com/user-attachments/assets/7fd27444-b4e6-41d1-b2bc-10318bbb25cb" width="300"/></td>
</tr>
</table>

---

### 3. Workshop Types

<table>
<tr>
<td><b>Desktop</b></td>
<td><b>Mobile</b></td>
</tr>
<tr>
<td><img src="https://github.com/user-attachments/assets/7c7801c8-09ad-4879-9974-a3cb29b07d69" width="100%"/></td>
<td><img src="https://github.com/user-attachments/assets/411ac74b-8c64-45e9-ba45-b5dca4bd6602" width="300"/></td>
</tr>
</table>

---

### 4. Workshop Status

<table>
<tr>
<td><b>Desktop</b></td>
<td><b>Mobile</b></td>
</tr>
<tr>
<td><img src="https://github.com/user-attachments/assets/356b5153-290f-4932-94d6-abdef045a3f8" width="100%"/></td>
<td><img src="https://github.com/user-attachments/assets/9ec24a0f-62d0-4b09-862e-a7ecaf5f7a70" width="300"/></td>
</tr>
</table>

---

### 5. Propose Workshop

<table>
<tr>
<td><b>Desktop</b></td>
<td><b>Mobile</b></td>
</tr>
<tr>
<td><img src="https://github.com/user-attachments/assets/3bed20e4-377e-496f-b664-88b0a7bf3318" width="100%"/></td>
<td><img src="https://github.com/user-attachments/assets/5f9c034a-fb2f-4ff9-8838-fd0139e436f9" width="300"/></td>
</tr>
</table>

---

### 6. Empty State

<table>
<tr>
<td><b>Desktop</b></td>
<td><b>Mobile</b></td>
</tr>
<tr>
<td><img src="https://github.com/user-attachments/assets/14518d39-b977-4744-a2ba-d2837ddf3130" width="100%"/></td>
<td><img src="https://github.com/user-attachments/assets/bbe55afb-4708-4f2d-9b1c-b396fd33f96f" width="300"/></td>
</tr>
</table>

---
## Submission Checklist

- [x] Code is readable and well-structured
- [x] Git history shows progressive work
- [x] README includes all 4 reasoning answers
- [x] README includes setup instructions
- [x] Before/after screenshots included (`/screenshots/`)
- [x] Code is documented where necessary
- [x] React used properly — not superficially
- [x] Mobile-first responsive design
- [x] Accessibility implemented throughout
- [x] Performance optimised (debounce, lazy loading, local fonts)
- [x] SEO meta tags present
- [x] No hardcoded secrets
- [x] `.env.example` provided
