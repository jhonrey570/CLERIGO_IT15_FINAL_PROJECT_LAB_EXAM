1.1. CANTEEN MANAGEMENT SYSTEM

1. IT15/L Integrative Programming — Final Project / Lab Exam
2. Student: Clerigo, Cortez, Salubre, Tulabing
3. Tech Stack: React.js + Laravel + MySQL



1.2. PROJECT STRUCTURE

Overall structure
1. canteen-backend — Laravel RESTful API
2. canteen-frontend — React.js Web Application



1.3. XAMPP

For testing
1. Open XAMPP control panel
2. Turn on the Apache
3. Turn on the MySQL



1.4. BACKEND SETUP (Laravel)

bash
1. cd canteen-backend
2. composer install
3. cp .env.example .env
4. php artisan key:generate
5. php artisan migrate --seed
6. php artisan serve



1.5. FRONTEND SETUP (React)

bash
1. cd canteen-frontend
2. npm install
3. cp .env.example .env
4. npm run dev



1.6. DEFAULT USER ACCOUNTS (After seeding)

Role/Temporary names, Email, Password
1. Admin admin@canteen.com password
2. Cashier cashier@canteen.com password
3. Customer customer@canteen.com password


   
1.7. GITHUB PUSHING

1. git add .
2. git commit -m "initial: setup repo structure and README"
3. git push origin main



1.8. FEATURES

1. Role-based authentication (Admin, Cashier, Customer)
2. Menu management with image upload and category filtering
3. Point-of-Sale (POS) interface for cashiers
4. Inventory tracking with low stock alerts
5. Inventory tracking with low stock alerts
6. Order processing with real-time status updates
7. Export sales reports to CSV



1.9. TECHNOLOGIES USED

1. Frontend — React.js, Tailwind CSS, Recharts
2. Backend — Laravel, PHP
3. Database — MySQL
4. Auth — Laravel Sanctum
5. API (Application Programming Interfac) — RESTful JSON API



2.1. API ENDPOINTS SUMMARY

Method, Endpoint, Description
1. POST — /api/login — Login and get token
2. POST — /api/register — Register a new account
3. GET — /api/menu-items — List all menu items
4. POST — /api/orders — Create a new order
5. PATCH — /api/orders/{id}/status — Update order status
6. GET — /api/inventory — View stock levels
7. GET — /api/reports/summary — Sales summary
8. GET — /api/reports/category-breakdown — Sales by category
9. GET — /api/reports/best-sellers — Top selling items
10. GET — /api/reports/order-volume — Order volume trend



2.2. DATABASE TABLES

Table, Description
1. users — Stores admin, cashier, and customer accounts
2. categories — Food categories (Meals, Snacks, Beverages, etc.)
3. menu_items — Menu items with price, stock, and availability
4. orders — Customer orders with status tracking
5. order_items — Line items linking orders to menu items
6. inventory_logs — Stock change history with reasons



2.3. ORDER STATUS FLOW

Pending → Preparing → Ready → Completed
                            ↘ Cancelled



2.4. ROLE PERMISSIONS

Feature                     Admin    Cashier    Customer
1. View Menu                Yes      Yes        Yes
2. Manage Menu
3. Place Orders
4. Update Order Status
5. View Inventory
6. Adjust Stock
7. View Reports
8. Manage Users
