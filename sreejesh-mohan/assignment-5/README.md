# 🍲 Adukkala — Authentic Kerala Kitchen & Culinary Journal

A production-grade, multi-page culinary web application engineered with **React 19**, **React Router v7**, and **Axios**. Powered by a rich repository of **authentic Kerala cuisine and Indian snacks**, Adukkala showcases the culinary heritage of God's Own Country—featuring Malabar delicacies, coastal seafood, crispy tea-time snacks, Onam Sadya specials, dynamic routing, custom data-fetching hooks, controlled search interfaces, interactive mise-en-place checklists, and resilient client-side state persistence.

---

## 🌟 Highlights & Key Capabilities

- **Single-Page Multi-Route Architecture**: Seamless client-side transitions via React Router v7 with zero page reloads, active route indicators, and 404 fallbacks.
- **Custom Asynchronous Hook (`useRecipes`)**: Encapsulated data-fetching layer with loading states, structured Axios error parsing, and unmount cancellation guards.
- **Controlled Search & Filtering**: Real-time controlled search bar with quick-suggestion chips, category filters, and dynamic sorting.
- **Interactive Mise en Place Checklist**: Dynamic recipe details parsed from API responses with interactive ingredient check-offs for kitchen prep.
- **Persistent Personal Journal**: Instant bookmarking via React Context API synchronized with `localStorage` for cross-page persistence.
- **Artisan Zen Aesthetic**: Bespoke design system utilizing warm stone linen, Sumi charcoal ink, deep matcha green, and minimalist ceramic surfaces.

---

## 📐 Technical Architecture

| Layer | Implementation | Details |
| :--- | :--- | :--- |
| **Routing & Navigation** | `react-router-dom` (v7) | • `<BrowserRouter>` root context<br>• Routes: `/` (Home), `/recipes` (Archive), `/recipes/:id` (Details via `useParams`), `/favourites` (Saved), and `*` (NotFound)<br>• Active link highlighting using `<NavLink>` |
| **Data Layer & API** | `axios` | • Configured instance in `src/api/axiosInstance.js`<br>• Dedicated base URL, timeout controls, and JSON serialization<br>• Comprehensive status code and network error handling |
| **Custom Hooks** | `useRecipes(query)` | • Custom hook returning `{ data, loading, error, refetch }`<br>• Cleanup flag preventing state mutations on unmounted components |
| **State Management** | Context API + `localStorage` | • `FavouritesContext` providing global bookmarked state<br>• Real-time synchronization across routes and browser sessions |
| **Form Handling** | Controlled Components | • React `useState` managing text input and submission events<br>• Instant tag triggers and search reset functionality |

---

## 🎨 Design System: Artisan Zen

Adukkala breaks away from typical high-saturation templates in favor of a calm, tactile culinary experience:

- **Canvas & Background**: Wabi-sabi Warm Stone Linen (`#f7f5f0`) & Soft Ivory (`#fdfcfb`)
- **Primary Accent**: Deep Matcha Green (`#2d5a3f`) & Dark Bamboo Forest (`#1f402c`)
- **Secondary Highlights**: Toasted Persimmon / Terracotta (`#c2633d`) & Sakura Crimson (`#be3a4e`)
- **Typography**: Contemporary geometric **Space Grotesk** headings paired with **Plus Jakarta Sans** for body legibility

---

## 📁 Directory Structure

```text
assignment-5/
├── index.html
├── package.json
├── vite.config.js
├── README.md
├── public/
│   └── favicon.svg                 # Minimalist ceramic bowl icon
└── src/
    ├── main.jsx                    # Application entry point with BrowserRouter & Providers
    ├── App.jsx                     # Top-level layout and route configuration
    ├── index.css                   # Global CSS reset, typography, and design tokens
    ├── App.css                     # Component styling, responsive grid, and animations
    ├── api/
    │   └── axiosInstance.js        # Configured Axios client
    ├── context/
    │   └── FavouritesContext.jsx   # Global persistent favorites state
    ├── hooks/
    │   └── useRecipes.js           # Custom recipe fetching hook
    ├── components/
    │   ├── Navbar.jsx              # Responsive navigation bar with active route indicators
    │   ├── Footer.jsx              # Clean, professional platform footer
    │   ├── RecipeCard.jsx          # Ceramic recipe card with favorite toggle & link
    │   ├── SearchBar.jsx           # Controlled search form with quick tags
    │   ├── LoadingSpinner.jsx      # Minimalist dual-ring loading indicator
    │   └── ErrorMessage.jsx        # Error card with retry action
    └── pages/
        ├── Home.jsx                # Landing page with hero banner & culinary disciplines
        ├── Recipes.jsx             # Recipe archive with search, categories, and sorting
        ├── RecipeDetail.jsx        # Detailed view using useParams & prep checklist
        ├── Favourites.jsx          # Saved recipes cookbook with filter and clear options
        └── NotFound.jsx            # 404 Catch-all route
```

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18.0 or higher)
- npm (v9.0 or higher)

### Installation
```bash
# Navigate to project directory
cd assignment-5

# Install dependencies
npm install
```

### Development
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser.

### Production Build
```bash
npm run build
```
Generates an optimized production build in the `dist/` directory.

---

## 📄 License
MIT © Adukkala
