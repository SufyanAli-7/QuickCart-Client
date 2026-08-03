# 🛒 QuickCart - E-Commerce Client Application

QuickCart is a modern, responsive, full-stack E-Commerce frontend web application built with **React**, **Vite**, **Tailwind CSS**, and **Ant Design**. It features a state-of-the-art UI, real-time cart & wishlist synchronization, dynamic role-based dashboards, and a complete checkout workflow.

---

## 🚀 Technologies Used

- **Framework / Bundler**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + Custom Design Tokens
- **UI Components & Icons**: [Ant Design v5](https://ant.design/) & `@ant-design/icons`
- **Routing**: [React Router v6](https://reactrouter.com/) (with custom `ScrollToTop` helper)
- **HTTP Client**: [Axios](https://axios-http.com/) (with HTTP-only cookie credentials)
- **State & Auth Management**: Custom React Context API (`AuthContext`)

---

## ✨ Key Features

### 🛍️ Public & Customer Storefront
- **Sticky Navigation Bar**: Top-level sticky header with branding logo, catalog search, user menu dropdown, cart link, and mobile drawer.
- **Hero Auto-Carousel Slider**: Responsive 3-slide hero banner with smooth 3-second auto-transitions.
- **Popular Products Section**: Top 6 active products grid (3 columns on PC, 1 on mobile) displaying product tags, price, wishlist toggle, details link, and cart actions.
- **Store Specifications Grid**: Highlighted store features (Free Shipping, 7 Days Easy Return, 24/7 Support).
- **Products Catalog Page (`/products`)**:
  - 9 products per page with Ant Design `<Pagination />`.
  - Grid layout (3 columns on PC, 1 on mobile).
  - Clean title banner with product counters and scroll reset on page switch.
- **Product Details Page (`/product/:id`)**:
  - Large product image preview box with stock badge and wishlist toggle button.
  - Price, category badge, shipping & quality highlights, and product description.
  - Live quantity counter (`-`, `qty`, `+`).
  - **Add to Cart** button & **Buy Now** button (adds product to cart and immediately redirects to `/cart`).

### 🛒 Cart & Checkout Workflow
- **Cart Page (`/cart`)**:
  - Itemized table with product thumbnails, titles, price, subtotal, and remove action.
  - Interactive arrow quantity controls (`<` `qty` `>`) calling `PATCH /api/cart/update/:productId`.
  - Order Summary card displaying Total Items, Subtotal, Free Shipping, and Total Amount.
  - Continue Shopping back link (`/products`).
- **Checkout Page (`/checkout`)**:
  - Shipping Form with auto-filled user email and name from `useAuth()`.
  - Fields for Phone, Street Address, City, Postal Code, and Order Notes.
  - Itemized Order Summary showing product list, quantities, unit prices, and final total.
  - **Place Order** action sending data to `POST /api/order/create`, clearing the cart, and automatically redirecting the user to `/dashboard/my-orders`.

### 📊 Role-Based Dashboards (`/dashboard`)
- **Admin Dashboard**:
  - 8 metric statistics cards (Total Revenue, Total Orders, Total Products, Total Customers, Active Wishlists, Low Stock Alerts, etc.).
  - Product Management (Create with image upload, Edit, Delete, Inactive/Active status).
  - Order Management & Customer Management tables.
  - Role-specific sidebar and mobile bottom navigation bar (`Home`, `Dashboard`, `Products`, `Orders`, `Users`).
- **Customer Dashboard**:
  - Metric cards (Total Orders, Wishlist Items, Cart Items, Total Spent).
  - **Wishlist Page**: Product grid with instant removal and direct product details links.
  - **My Orders Page**: Order history list with status tags, shipping details, and items overview.
  - Role-specific sidebar and mobile bottom navigation bar (`Home`, `Dashboard`, `Wishlist`, `My Orders`).

---

## 🛠️ Project Setup & Installation

1. **Navigate to Client Directory**:
   ```bash
   cd Client
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   Create a `.env` file in the `Client` root folder:
   ```env
   VITE_BACKEND_URL=http://localhost:5000
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 📁 Directory Structure

```text
Client/
├── src/
│   ├── assets/               # Images and SVG icons
│   ├── components/           # Reusable UI Components
│   │   ├── Footer/           # Store footer
│   │   ├── Header/           # Sticky Header & Navbar
│   │   └── Misc/             # ProtectedRoute, ScrollToTop, Page404, Loader
│   ├── config/               # Global Toastify & Axios configs
│   ├── context/              # AuthContext & AppProvider
│   ├── pages/                # Page Views
│   │   ├── Auth/             # Login & Register views
│   │   ├── Dashboard/        # Admin & Customer Dashboard views
│   │   ├── Frontend/         # Public pages (Home, Products, ProductDetails, Cart, Checkout)
│   │   └── Routes.jsx        # Main application router
│   ├── App.jsx               # Root App component
│   └── main.jsx              # Entry point with BrowserRouter & AppProvider
├── package.json
└── vite.config.js
```
