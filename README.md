# 🍽️ Canteen Management System
**IT15/L Integrative Programming — Final Project / Lab Exam**
**Student:** Clerigo
**Tech Stack:** React.js + Laravel + MySQL

---

## 📁 Project Structure
- `canteen-backend/` — Laravel RESTful API
- `canteen-frontend/` — React.js Web Application

---

## 🚀 Backend Setup (Laravel)
```bash
cd canteen-backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

## 💻 Frontend Setup (React)
```bash
cd canteen-frontend
npm install
cp .env.example .env
npm start
```

---

## 👤 Default User Accounts (after seeding)
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@canteen.com | password |
| Cashier | cashier@canteen.com | password |
| Customer | customer@canteen.com | password |
```

---

### 📤 Step 6 — Push Everything to GitHub

Back in your terminal (make sure you're still inside your project folder), run:
```
git add .
git commit -m "initial: setup repo structure and README"
git push origin main
