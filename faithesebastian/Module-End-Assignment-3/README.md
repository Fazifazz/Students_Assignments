Objective:
The purpose of this assignment is to evaluate complete React application
development skills — component architecture, global state with Context API,
routing, API integration, and deployment — by building the full ShopNest
frontend ready to connect to the Phase 4 backend.

Assignment: Develop and deploy the complete React frontend for the
ShopNest e-commerce platform.

Requirements:
● Set up React Router DOM with routes for Home, Products, Product
Detail (/products/:id), Cart, and Contact pages.
● Build reusable components: Navbar, ProductCard, CartItem, ProductGrid,
and CategoryFilter.
● Manage global cart state using the Context API and useContext hook —
no prop drilling; cart accessible from any component.
● Fetch products from the backend API using useEffect and Axios —
display a loading spinner while fetching and show a user-friendly error
message if the fetch fails.
● Build the Product Detail page — clicking a ProductCard navigates to
/products/:id using useParams, displaying full product details and an
'Add to Cart' button.
● Build the Cart page — display all cart items with quantity +/– controls
and remove button; show subtotal, tax estimate, and total.
