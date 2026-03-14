CANTEEN MANAGEMENT SYSTEM
IT15/L Integrative Programming — Final Project / Lab Exam
Student: Clerigo, Cortez, Salubre, Tulabing
Tech Stack: React.js + Laravel + MySQL

PROJECT STRUCTURE
Overall structure
1. canteen-backend — Laravel RESTful API
2. canteen-frontend — React.js Web Application

XAMPP
For testing
1. Open XAMPP control panel
2. Turn on the Apache
3. Turn on the MySQL

BACKEND SETUP (Laravel)
bash
cd canteen-backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve

FRONTEND SETUP (React)
bash
cd canteen-frontend
npm install
cp .env.example .env
npm run dev

DEFAULT USER ACCOUNTS (After seeding)
Role/Temporary names, Email, Password
1. Admin admin@canteen.com password
2. Cashier cashier@canteen.com password
3. Customer customer@canteen.com password
   
GITHUB PUSHING
git add .
git commit -m "initial: setup repo structure and README"
git push origin main

FEATURES
1. Role-based authentication (Admin, Cashier, Customer)
2. Menu management with image upload and category filtering
3. Point-of-Sale (POS) interface for cashiers
4. Inventory tracking with low stock alerts
5. Inventory tracking with low stock alerts
6. Order processing with real-time status updates
7. Export sales reports to CSV

TECHNOLOGIES USED
1. Frontend — React.js, Tailwind CSS, Recharts
2. Backend — Laravel, PHP
3. Database — MySQL
4. Auth — Laravel Sanctum
5. API (Application Programming Interfac) — RESTful JSON API

API ENDPOINTS SUMMARY
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

DATABASE TABLES
Table, Description
1. users — Stores admin, cashier, and customer accounts
2. categories — Food categories (Meals, Snacks, Beverages, etc.)
3. menu_items — Menu items with price, stock, and availability
4. orders — Customer orders with status tracking
5. order_items — Line items linking orders to menu items
6. inventory_logs — Stock change history with reasons

ORDER STATUS FLOW
Pending → Preparing → Ready → Completed
                            ↘ Cancelled

ROLE PERMISSIONS

Feature    Admin    Cashier    Customer
