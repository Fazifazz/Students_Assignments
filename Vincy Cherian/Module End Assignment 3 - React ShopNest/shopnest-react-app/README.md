# ShopNest – React E-Commerce Frontend

ShopNest is a responsive e-commerce frontend application built with React. It allows users to browse products, explore product details, filter products by category, and manage a shopping cart.

This project was developed as part of **Module End Assignment 3 – React Frontend** to demonstrate React component architecture, client-side routing, API integration, and global state management.

## Features

- **Home Page:** Landing page for the ShopNest application.
- **Products Page:** Fetches and displays products from an external API.
- **Product Details:** Displays individual product information using dynamic routing.
- **Category Filter:** Filters products based on the selected category.
- **Product Search:** Allows users to search for products.
- **Shopping Cart:** Add products, remove items, and increase or decrease quantities.
- **Cart Summary:** Displays total item count, estimated tax, and total amount.
- **Global State Management:** Shares cart data across components using Context API and `useReducer`.
- **Cart Persistence:** Uses browser `localStorage` to retain cart items after a page refresh.
- **Contact Page:** Provides contact information for the ShopNest application.
- **Responsive UI:** Uses Bootstrap for layout and styling.
- **Loading and Error States:** Handles product API loading and fetch errors.

## Technologies Used

- React
- JavaScript (ES6+)
- React Router DOM
- Axios
- Context API
- `useReducer`, `useState`, `useEffect`, and `useContext` Hooks
- Bootstrap
- HTML5
- CSS3
- FakeStore API

## API Integration

Product information is fetched from the FakeStore API using Axios and React's `useEffect` hook.

**API Base URL:** https://fakestoreapi.com

Example endpoints:

- `GET /products` – Fetch all products.
- `GET /products/:id` – Fetch details of an individual product.

## Application Routes

| Route | Description |
|---|---|
| `/` | Home page |
| `/products` | Product listing and category filtering |
| `/products/:id` | Individual product details |
| `/cart` | Shopping cart and order summary |
| `/contact` | Contact page |

## State Management

The application uses React Context API to make cart data accessible throughout the application without prop drilling.

The `useReducer` hook manages cart actions, including:

- Adding products to the cart
- Removing products from the cart
- Decreasing product quantities
- Clearing the cart

Cart items are stored in `localStorage` so they can be restored when the application is reopened or refreshed.

## Getting Started

### Prerequisites

- Node.js
- npm
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone <your-github-repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd <your-project-folder>
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL displayed in your terminal to view the application.

## Project Structure

```text
src/
├── components/
│   ├── Navbar.jsx
│   ├── ProductCard.jsx
│   ├── ProductGrid.jsx
│   ├── CategoryFilter.jsx
│   └── CartItems.jsx
├── pages/
│   ├── Home.jsx
│   ├── Products.jsx
│   ├── ProductDetails.jsx
│   ├── Cart.jsx
│   └── Contact.jsx
├── context/
│   └── CartContext.jsx
├── reducers/
│   └── CartReducers.jsx
├── App.jsx
├── main.jsx
└── index.css
```

*Note: Adjust the folder and file names above to match your actual project structure.*

## Deployment

The application can be deployed to Netlify.

1. Push the project to GitHub.
2. Import the GitHub repository into Netlify.
3. Set the build command to `npm run build`.
4. Set the publish directory to `dist` for a standard Vite project.
5. Deploy the application and verify that all routes work correctly.

**Live Demo:** https://shopnestecomapp.netlify.app/

## Learning Outcomes

This project demonstrates practical implementation of:

- React component-based architecture
- Reusable UI components
- Client-side routing with React Router DOM
- Dynamic routes and URL parameters using `useParams`
- API requests using Axios
- Global state management with Context API and `useReducer`
- Browser storage using `localStorage`
- Responsive interface development with Bootstrap

## Author

**Vincy Cherian**

Module End Assignment 3 – React Frontend
