# Odoo Academy

> Deep **Functional + Technical** learning paths with real Odoo screen pedagogy (Odoo 17/18 oriented).

**Learn Odoo. Practice Odoo. Master Odoo.**

Independent interactive learning platform for Odoo — pure **HTML5**, **CSS3**, and **Vanilla JavaScript**.  
No frameworks. Accounts (name + phone + password), cloud progress sync and an admin dashboard run on Supabase (RPC functions, no direct table access).

> Odoo Academy is an **independent educational product**. It is **not** affiliated with or endorsed by Odoo S.A.

---

## Features

| Area | Details |
|------|---------|
| **Learning paths** | 7 paths · **51+ lessons** — Fundamentals, CRM & Sales, Inventory, Purchase, Accounting & Invoicing |
| **Real Odoo screens** | 48 lesson visuals from official Odoo documentation (educational use) |
| **Pedagogy** | Why → Screen → Steps → Example → Try on screen → Tip → Common mistake → Knowledge check |
| **Quizzes** | 5 end-of-path challenges with XP |
| **Practice labs** | Sales, Inventory, Purchase simulators + Create Customer lab |
| **Certificates** | Printable path certificates when a path reaches 100% |
| **Gamification** | XP, levels, streaks, achievements |
| **i18n** | Arabic (RTL) and English (LTR) |
| **Theme** | Light / Dark |
| **Progress** | Per path + export/import JSON backup |
| **App shell** | SPA hash router, search, responsive layout, keyboard-friendly modals |

---

## Quick start

1. Clone or download this repository.
2. Open `index.html` in a modern browser (Chrome, Firefox, Edge, Safari).

Or serve locally:

```bash
npx serve .
# or
python3 -m http.server 8080
```

No build step. No `npm install` required for the app itself.

---

## Project structure

```
odoo-academy/
├── index.html
├── README.md
├── LICENSE
├── .gitignore
└── assets/
    ├── css/
    │   └── style.css
    ├── icons/          # App / path icons (SVG, PNG)
    ├── images/         # Real Odoo UI screenshots (educational)
    └── js/
        ├── app.js          # Bootstrap & routes
        ├── router.js       # Hash SPA router
        ├── state.js        # App state + LocalStorage rules
        ├── storage.js      # LocalStorage helpers
        ├── i18n.js         # AR / EN strings
        ├── lessons.js      # Paths + lesson content
        ├── quizzes.js      # Quiz definitions
        ├── gamification.js # Achievements
        ├── simulator.js    # Lab validation logic
        └── ui.js           # Rendering & interactions
```

---

## Learning paths

| Path | Level | Lessons | Notes |
|------|-------|---------|--------|
| Odoo Fundamentals | Beginner | 10 | Free |
| CRM & Sales | Intermediate | 10 | Pro |
| Inventory | Intermediate | 10 | Pro |
| Purchase | Intermediate | 6 | Pro |
| Accounting & Invoicing | Intermediate | 5 | Pro |
| Manufacturing | Intermediate | 5 | Pro |
| Human Resources | Intermediate | 5 | Pro |
| Technical Foundations | Advanced | 5 | Pro |
| Point of Sale | Intermediate | 3 | Pro |
| Projects & Timesheets | Intermediate | 3 | Pro |
| Accounting (deep) | Intermediate | 8 | Pro |

Simulators, extra labs, and certificates for paid paths follow the same Pro gate (demo activation available on the Pricing page — no real payment in this MVP).

---

## How progress works

- State key: `odoo_academy_state` in LocalStorage.
- **Settings → Export JSON / Import JSON** to back up or move progress between devices.
- **Reset progress** clears learning data and keeps language, theme, and display name preferences.

---

## Screenshots attribution

Lesson screenshots are taken from the **official Odoo documentation** repository  
(https://github.com/odoo/documentation) for **educational purposes only**.

Odoo® is a trademark of Odoo S.A.

---

## License

This project’s own source code is provided for learning and demonstration.  
Do not use official Odoo trademarks as product branding.  
See `LICENSE` for terms applicable to this repository’s code.

---

## Roadmap ideas

- More paths (e.g. Manufacturing, HR)
- Deeper multi-step simulators
- Optional service worker for offline use
- Real payment provider (Stripe / Paddle) for Pro plans

---

## Accounts & Admin

- Sign up with **name + phone + password**; each user has a private account and synced progress.
- The **first account registered becomes the admin** → sidebar shows the Admin dashboard (users list, search, CSV export, reset password, delete).
- Backend: Supabase tables `academy_users`, `academy_sessions`, `academy_login_attempts` (RLS on, no direct access) + `academy_*` RPC functions.
