# Frontend

React + Tailwind CSS project
This repo contains the frontend setup with:

- **React 18** (Create React App base)
- **Tailwind CSS v3** (light/dark mode enabled, semantic utilities for colors/typography)
- **React Router DOM v6** (routing for public + protected pages)
- **Lucide React** (icons)
- **Date-fns** (date utilities & formatting)
- **React DayPicker** (custom date picker component)
- **React Hook Form** (form state management)
- **Zod** (schema validation with RHF integration)
- **Node.js 18+** recommended runtime

📄 Design reference: [Figma / Docs link here](https://www.figma.com/design/9K5unuJLpJ16O5Ho3ymvXH/Fitness---Nutrition-Planner-Design?node-id=31-80&t=Rie43tyizYnLLLnP-1)

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npm start

# Build for production
npm run build
```

---

## 🗂 Folder Structure

```bash
frontend/
├─ public/               # Static files (index.html, favicon, etc.)
├─ src/
│  ├─ components/        # Reusable UI pieces (buttons, inputs, toggles etc.)
│  ├─ pages/             # Page-level components (Dashboard, Profile, etc.)
│  ├─ layouts/           # Layout wrappers (Navbar, Sidebar, etc.)
│  ├─ styles/            # Global CSS (typography, utilities, tokens)
│  ├─ hooks/             # Custom React hooks
│  ├─ utils/             # Helpers, constants
│  ├─ App.jsx            # App entry point
│  ├─ index.js           # React root
│  └─ index.css          # Tailwind base + custom classes
├─ package.json
└─ tailwind.config.js
```

## 📑 Page List (Tentative)

**Guest**

- `/` – Landing (feature overview)
- `/privacy` – Privacy Policy
- `/terms` – Terms & Conditions
- `/auth/login` – Login
- `/auth/create-profile` – Registration (Profile step)
- `/auth/create-account` – Registration (Account step)

**App (Protected)**

- `/app` – Dashboard
- `/app/workouts` – Workouts (tabs: Sessions • Exercise Log • Routines • History)
- `/app/nutrition` – Nutrition (tabs: Search & Log • History • Favourites & Recipes • Daily Macros)
- `/app/insights` – Chart insights
- `/app/profile` – Profile / Settings

**Utility**

- `/maintenance` – Maintenance/Unavailable
- 404 Not Found

## 🎨 Design Tokens

### Typography

- .h1 – large heading
- .h2 … .h6 – headings
- .p1, .p2, .p3 – paragraphs
- .b1, .b2, .b3 – button text

### Colors

- bg-base – background (white/dark gray)
- text-primary – main text color (black/white)
- btn-primary, btn-secondary – button color utilities
- border-subtle, border-strong – border utilities
