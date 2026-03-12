# 🍽️ Canteen Management System — Backend API
**IT15/L Integrative Programming — Final Project / Lab Exam**
**Student:** Clerigo
**Framework:** Laravel 11 + MySQL

---

## 📋 About
This is the RESTful API backend for the Canteen Management System built with Laravel 11 and secured with Laravel Sanctum for token-based authentication.

---

## 🛠️ Technologies Used
| Technology | Version |
|---|---|
| PHP | 8.4+ |
| Laravel | 11+ |
| Laravel Sanctum | Latest |
| MySQL | 8+ |
| Composer | 2+ |

---

## 🚀 Setup Instructions

### 1. Install dependencies
```bash
composer install
```

### 2. Copy environment file
```bash
cp .env.example .env
```

### 3. Generate application key
```bash
php artisan key:generate
```

### 4. Configure your database
Open `.env` and update these values:
```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=canteen_db
DB_USERNAME=root
DB_PASSWORD=
```

### 5. Run migrations and seeders
```bash
php artisan migrate --seed
```

### 6. Start the server
```bash
php artisan serve
```

The API will be available at `http://127.0.0.1:8000`

---

## 👤 Default Seeded Accounts
| Role | Email | Password |
|---|---|---|
| Admin | admin@canteen.com | password |
| Cashier | cashier@canteen.com | password |
| Customer | juan@email.com | password |

---

## 📌 API Endpoints Summary
| Group | Base Path |
|---|---|
| Authentication | `/api/login`, `/api/register`, `/api/logout` |
| Categories | `/api/categories` |
| Menu Items | `/api/menu-items` |
| Orders | `/api/orders` |
| Inventory | `/api/inventory` |
| Reports | `/api/reports` |

---

## 🗄️ Database Structure
| Table | Description |
|---|---|
| users | Admin, Cashier, Customer accounts |
| categories | Food categories |
| menu_items | All menu items with stock |
| orders | Customer orders |
| order_items | Line items per order |
| inventory_logs | Stock change history |