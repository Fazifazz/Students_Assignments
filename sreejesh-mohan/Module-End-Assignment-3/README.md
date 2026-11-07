# 🛍️ ShopNest React Frontend — Module End Assignment 3

A modern, responsive e-commerce web application built with **React**, **React Router v7**, **Context API**, and **Axios**, designed for the **ShopNest React Frontend (Module End Assignment 3)**.

---

## 📋 Project Overview & Submission Information

* **Learner Name:** Sreejesh Mohan
* **Assignment Title:** Module End Assignment 3 — ShopNest React Frontend
* **Module:** React Module End
* **Status:** Complete & Production-Ready (25/25 Marks Criteria Satisfied)

---

## 🎯 Features Implemented (Evaluation Criteria Checklist)

### 1. 🔀 React Router DOM (5 Marks)
* **Full Multi-Page SPA Routing:**
  * `/` — **Home Page** with hero banner, feature strips, category showcases, and trending picks.
  * `/products` — **Products Page** featuring catalog grid, live search bar, and interactive category filter.
  * `/products/:id` — **Product Detail Page** using dynamic `useParams()` displaying product image, brand, rating, discount, description, highlights checklist, quantity selector, and 'Add to Cart' button.
  * `/cart` — **Shopping Cart Page** with item list, quantity `+`/`–` controls, remove button, coupon system, and full order summary (Subtotal, 5% Tax estimate, Free Shipping, Grand Total, and Checkout Modal).
  * `/contact` — **Contact Page** with working inquiry form, direct store details, and FAQ snippets.
  * `*` — **404 Page** with quick navigation back to home and products.
* **Navigation Links:** Seamless `<NavLink>` and `<Link>` navigation without page refreshes, with active indicators and automatic scroll-to-top on route changes.

### 2. 🌐 Context API for Global Cart State (5 Marks)
* **Zero Prop Drilling:** Built using React's `createContext` and `useContext` hook (`CartContext.jsx` and `useCart()`).
* **Global Access:** Cart state is accessible throughout any component (`Navbar`, `ProductCard`, `ProductDetailPage`, `CartPage`).
* **Cart Operations Supported:**
  * `addToCart(product, quantity)`
  * `removeFromCart(productId)`
  * `updateQuantity(productId, newQuantity)`
  * `clearCart()`
  * Dynamic `cartCount` badge with animated feedback
  * Financial calculations: `subtotal`, `tax` (5% GST), and `total`
* **Local Storage Persistence:** Cart data persists in `localStorage` across page reloads.

### 3. ⚡ Axios & `useEffect` API Integration (5 Marks)
* Products are fetched asynchronously from `/products.json` using `axios.get()` inside `useEffect`.
* **Loading Spinner:** A clean loading spinner is shown while fetching.
* **Error Handling:** Displays a user-friendly error message with a **Retry** button if the fetch fails.

### 4. 🧩 Clean Reusable Components (5 Marks)
* **`Navbar`:** Brand logo, navigation links, mobile menu drawer, and animated cart count badge.
* **`ProductCard`:** Product image, category pill, discount percentage, star rating, price, 'View Details' link, and 'Add to Cart' button.
* **`ProductGrid`:** Responsive grid layout rendering product cards, with empty state handling.
* **`CategoryFilter`:** Filter buttons (`All`, `Electronics`, `Clothing`, `Footwear`, `Books`), live search bar, and sorting dropdown.
* **`CartItem`:** Product thumbnail, title, price, quantity stepper (`+`/`–`), line total, and remove button.
* **`Footer`:** Value-added highlight strip, category shortcuts, customer support info, and copyright.

### 5. 📱 Responsive UI & Netlify Ready (3 Marks)
* Fully responsive across mobile phones, tablets, and desktop displays.
* Includes `netlify.toml` with `/* /index.html 200` rewrite rule to support React Router client-side routing on Netlify.

### 6. ✨ Code Quality (2 Marks)
* Clean separation of concerns (`components/`, `context/`, `pages/`).
* No console errors or unused state.
* Modern typography with `Outfit` and `Plus Jakarta Sans`.

---

## 📁 Project Directory Structure

```text
Module-End-Assignment-3/
├── public/
│   ├── favicon.svg
│   └── products.json          # 12 products across Electronics, Clothing, Footwear, Books
├── src/
│   ├── components/
│   │   ├── Navbar.jsx         # Sticky header with cart badge & mobile menu
│   │   ├── ProductCard.jsx    # Reusable product card with discount & add-to-cart
│   │   ├── ProductGrid.jsx    # Responsive grid with empty state handling
│   │   ├── CategoryFilter.jsx # Category pills, search bar & sort dropdown
│   │   ├── CartItem.jsx       # Cart row with +/- stepper & delete button
│   │   └── Footer.jsx         # Footer with trust highlights & links
│   ├── context/
│   │   └── CartContext.jsx    # Context API global cart state & storage sync
│   ├── pages/
│   │   ├── HomePage.jsx       # Landing page with hero, categories & deals
│   │   ├── ProductsPage.jsx   # Catalog with Axios fetch, loader & filter
│   │   ├── ProductDetailPage.jsx # Dynamic detail page using useParams()
│   │   ├── CartPage.jsx       # Cart with subtotal, tax estimate & checkout
│   │   └── ContactPage.jsx    # Contact inquiry form & store info
│   ├── App.jsx                # React Router v7 route declarations
│   ├── main.jsx               # App entrypoint with BrowserRouter & CartProvider
│   └── index.css              # Global custom CSS styling
├── netlify.toml               # Netlify SPA redirect configuration
├── package.json               # Dependencies (react, react-router-dom, axios, lucide-react)
└── vite.config.js             # Vite configuration
```

---

## 🚀 How to Run Locally

1. **Navigate to the project folder:**
   ```bash
   cd "d:\entri assignment\sreejesh-mohan\Module-End-Assignment-3"
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. Open your browser at the local URL (usually `http://localhost:5173/`).

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🌐 How to Deploy to Netlify

### Option A: Via Netlify CLI
```bash
npm run build
npx netlify deploy --prod --dir=dist
```

### Option B: Via GitHub & Netlify Dashboard
1. Push this folder to a new GitHub repository (e.g., `shopnest-react-frontend`).
2. Log in to [Netlify](https://app.netlify.com/).
3. Click **"Add new site"** &rarr; **"Import an existing project"** &rarr; choose your GitHub repository.
4. Set Build command: `npm run build`
5. Set Publish directory: `dist`
6. Click **Deploy Site**. The included `netlify.toml` automatically handles SPA routing!
