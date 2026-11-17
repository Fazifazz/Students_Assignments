# Bistro POS

A restaurant billing app with a React + Vite frontend and an Express API.

## Run locally

```bash
npm install
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:4001

The root `.env` file configures the API port (`PORT`) and Vite frontend port (`VITE_PORT`). `.env.example` contains the default values.

The dashboard (`/`) includes a date-range filter and daily sales report. Create bills on `/bill`; manage products on `/products` and add a product on `/products/new`; manage categories on `/categories`; manage open dine-in orders on `/tables`; review, edit, print, or delete completed bills on `/orders`. Open table orders can be saved and resumed by table number and are stored in `backend/data/openTables.json` until checkout. Categories are managed with `GET /api/categories`, `POST /api/categories`, `PUT /api/categories/:id`, and `DELETE /api/categories/:id`; renaming updates assigned products, and deletion is blocked until products are reassigned. Category data is saved in `backend/data/categories.json`. Products are provided by `GET /api/menu`; add, edit, and remove products with `POST /api/menu`, `PUT /api/menu/:id`, and `DELETE /api/menu/:id`. Product changes are saved in `backend/data/products.json`; removed products are hidden from the active menu while remaining available for saved bill history. Bills are created through `POST /api/orders`, listed through `GET /api/orders`, updated through `PUT /api/orders/:id`, and deleted through `DELETE /api/orders/:id`. Orders are saved in `backend/data/orders.json` by Express and survive server restarts. Bills include dine-in or takeout service, an optional dine-in table number, and an optional customer mobile number. The current cart, tax rate, service type, and table number are kept in browser localStorage; customer mobile numbers are saved with open table orders and completed bills. Menu photos and artwork are bundled locally under `frontend/public/menu`; the photos are from [Unsplash](https://unsplash.com/license). The tax rate starts at 5% and is adjustable on each bill.

To create a production frontend bundle, run `npm run build`; the Express server serves that bundle when available.

Run billing calculation tests with `npm test`.

The login screen is a UI-only demo gate. It accepts any required email and password values and does not authenticate users or protect the API.
