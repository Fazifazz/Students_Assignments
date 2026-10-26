# ShopNest — Premium E-commerce Frontend

A responsive React e-commerce frontend built with React Router, Context API, Axios, and Bootstrap.

## Features
- Home, Products, Product Detail, Cart, and Contact routes
- Global cart state using Context API and `useContext`
- Axios + `useEffect` product API request with loading, error, and retry states
- 24 curated catalogue products across Clothing, Chappal & Footwear, Electronics, and Books
- Search, category filtering, sorting, product ratings, specification highlights
- Quantity controls, remove action, subtotal, estimated tax, and total
- Cart and wishlist persistence with `localStorage`
- Bootstrap toast feedback, responsive layout, and Netlify SPA routing

## Run locally
1. Install Node.js (LTS) if it is not installed.
2. Extract this folder and open it in VS Code.
3. Open Terminal → New Terminal.
4. Run `npm install`
5. Run `npm run dev`
6. Open the local URL shown in the terminal.

## Build for deployment
Run `npm run build`. Vite creates the production website in `dist/`.

## Deploy to Netlify
1. Push this project to a GitHub repository.
2. In Netlify, choose **Add new site → Import an existing project**.
3. Connect the repository.
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Deploy and submit the generated live URL.

The included `netlify.toml` handles React Router refreshes on nested routes.

## API note
The app requests product data from Fake Store API using Axios. The curated catalogue ensures all four assignment categories remain available. If the remote API is unavailable, the app displays a clear notice and continues with the curated catalogue.

## Important
Ratings and review counts for the curated catalogue are demonstration data, not verified customer reviews. Tax is an illustrative 5% estimate and should be adjusted for any real business or jurisdiction.
