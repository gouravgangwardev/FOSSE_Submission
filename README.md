# WorkshopHub 🎓

A production-ready **Workshop Booking System** built with Django REST Framework + React (Vite).

---

## Tech Stack

| Layer     | Technology                                       |
|-----------|--------------------------------------------------|
| Backend   | Django 4.2, Django REST Framework, python-decouple, django-filter |
| Frontend  | React 18, Vite, React Router v6, CSS Modules     |
| Database  | SQLite (dev) — swap to PostgreSQL for production |
| Auth      | DRF Token + Session auth (API-ready)             |

---

## Quick Start

### 1. Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configure environment
cp .env.example .env          # edit SECRET_KEY, DEBUG, ALLOWED_HOSTS

python manage.py migrate
python manage.py shell < seed_data.py   # loads sample data
python manage.py createsuperuser        # optional admin access
python manage.py runserver              # http://localhost:8000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev     # http://localhost:5173
```

Vite proxies all `/api/*` calls to Django — no CORS issues in development.

---

## API Endpoints

| Method | Endpoint                          | Description                         |
|--------|-----------------------------------|-------------------------------------|
| GET    | `/api/workshops/`                 | List workshops (filterable, searchable) |
| GET    | `/api/workshops/<id>/`            | Workshop detail                     |
| GET    | `/api/categories/`                | All categories                      |
| POST   | `/api/book/`                      | Create a booking                    |
| GET    | `/api/booking/lookup/?code=&email=` | Look up a booking                |

### Query Parameters (`/api/workshops/`)

- `search` — full-text search on title, description, instructor, tags
- `status` — `upcoming` | `ongoing` | `completed` | `cancelled`
- `level` — `beginner` | `intermediate` | `advanced`
- `category` — category slug (e.g. `python`, `ml`)
- `is_online` — `true` | `false`
- `ordering` — `start_date` | `-start_date` | `price` | `title`
- `page` — pagination

---

## Design Principles

### Visual System
- **Design tokens** — all colours, spacing, radii and shadows live in CSS custom properties (`globals.css`). Zero magic numbers in component CSS.
- **CSS Modules** — scoped, collision-free styling per component. No global class pollution.
- **Type hierarchy** — two typefaces: `Inter` (body) and `Sora` (display headings) loaded from Google Fonts with `display=swap`.

### Component Architecture
- **Atomic design** — `Badge`, `Spinner`, `EmptyState` are primitives. `WorkshopCard`, `FilterBar` are composites. Pages are orchestrators.
- **Custom hooks** — `useWorkshops`, `useWorkshop`, `useCategories` encapsulate fetch logic and state. Pages stay declarative.
- **Single API client** — `api/client.js` is the single point of contact with the backend. All error normalisation happens there.

### UX
- **Optimistic feedback** — skeleton loaders during fetch, instant filter updates, animated card entry (`fadeUp`).
- **Accessibility** — semantic HTML (`article`, `section`, `aside`, `nav`, `dl`), `aria-label` on interactive regions, `aria-live` for dynamic content, `role="alert"` for errors, full keyboard navigation.
- **Empty + error states** — every async operation has a loading, empty and error branch.
- **3-step booking flow** — Details → Review → Confirm, with inline validation and clear progress indicator.

---

## Responsiveness Strategy

- **Mobile-first** — base styles target small screens; `min-width` breakpoints add complexity progressively.
- **Fluid type** — `clamp()` for hero headings; they scale between 2 rem (mobile) and 3.25 rem (desktop) without breakpoint jumps.
- **Grid layout** — workshop grid is `1fr` on mobile, `repeat(2, 1fr)` at 640 px, `repeat(3, 1fr)` at 1024 px.
- **Sticky sidebar** — detail and booking pages use a two-column grid at 900 px; the sidebar becomes `position: sticky` to stay in view while scrolling the main content.

---

## Folder Structure

```
workshop_booking/
├── backend/
│   ├── config/             Django project config (settings, urls, wsgi)
│   ├── workshops/          Workshop & Category models, serializers, views, urls, admin
│   ├── bookings/           Booking model, serializers, views, urls, admin
│   ├── seed_data.py        One-shot sample data script
│   ├── requirements.txt
│   └── .env                Secret config (never commit)
│
└── frontend/
    ├── public/             Static assets (favicon)
    ├── src/
    │   ├── api/            Fetch client
    │   ├── components/     Shared UI components (each with .module.css)
    │   ├── hooks/          Data-fetching custom hooks
    │   ├── pages/          Route-level page components
    │   ├── styles/         Global CSS (tokens, reset, utilities)
    │   └── utils/          Pure helpers (formatting, colours)
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## Trade-offs & Decisions

| Decision | Rationale |
|----------|-----------|
| SQLite for DB | Zero-config for evaluation; swap `DATABASES` in settings for PostgreSQL |
| No Redux / Zustand | Scope doesn't need global state; React state + context is sufficient |
| No Tailwind | CSS Modules keep styles co-located and explicit; no purge/JIT config needed |
| Token auth wired but not enforced on public routes | Booking creation is public; token auth is available for admin-facing extensions |
| Duplicate booking prevented via DB `unique_together` + serializer validation | Belt-and-suspenders: validation at API layer, constraint at DB layer |
| Auto-confirm / auto-waitlist in `Booking.save()` | Keeps the API surface simple; status is always correct without extra client logic |

---

## Challenges

- **Vite proxy** removes the need for `CORS_ALLOWED_ORIGINS` during development while keeping the production CORS config correct for when React is served separately.
- **Seat counting** is a derived property (`available_seats`) computed on each request. For high-traffic production, this should be replaced with a cached counter or a DB-level aggregate with `select_for_update`.
- **Font loading** uses `display=swap` to avoid invisible text during load, but fonts are loaded from Google Fonts — swap to self-hosted for offline/intranet deployments.

---

## Environment Variables

| Variable        | Default | Description                        |
|-----------------|---------|------------------------------------|
| `SECRET_KEY`    | —       | Django secret key (required)       |
| `DEBUG`         | `False` | Enable debug mode                  |
| `ALLOWED_HOSTS` | `localhost` | Comma-separated allowed hosts  |
