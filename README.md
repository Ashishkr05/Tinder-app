
# ❤️ PHP Tinder App — Swipe, Like, and Match Experience

A full-stack Tinder-style application built with **React Native (frontend)** and **Laravel (backend)**.
Users can log in, swipe left/right to like or dislike people, and view their liked list.
The backend API is fully documented and publicly testable via Swagger and ngrok.

---

## 🚀 Features Overview

### 🔹 Backend (Laravel)

* User authentication with Laravel Sanctum
* List of people with pagination
* Like / Dislike endpoints
* Liked people list (paginated, newest first)
* Cron job to notify admin if someone crosses 50+ likes
* Swagger API docs (public via ngrok)

### 🔹 Frontend (React Native)

* Tinder-style swipe deck with animations
* Like / Nope buttons with effects
* Liked list tab
* Smooth login & persistent auth
* Responsive UI inspired by Tinder

---

## 📦 Tech Stack

**Backend:** PHP 8 + Laravel 11 + MySQL
**Frontend:** React Native (Expo) + Recoil + React Query
**Tools:** L5-Swagger, ngrok, Sanctum, Artisan Commands

---

## 🛠️ Installation & Setup

### 1️⃣ Clone the repo

```bash
git clone https://github.com/Ashishkr05/Tinder-app.git
cd php-tinder-app/backend
```

### 2️⃣ Install dependencies

```bash
composer install
```

### 3️⃣ Environment setup

Copy `.env.example` and configure your local values:

```bash
cp .env.example .env
php artisan key:generate
```

Set database and app URL:

```env
APP_URL=http://127.0.0.1:8000
DB_DATABASE=tinder
DB_USERNAME=***
DB_PASSWORD=****
MAIL_MAILER=log
```

### 4️⃣ Run migrations & seed demo data

```bash
php artisan migrate --seed
```

Demo credentials:

```
email: demo@user.test  
password: password
```

### 5️⃣ Start backend server

```bash
php artisan serve
```

---

## 🌍 Making Swagger Public (with ngrok)

### 1️⃣ Run ngrok tunnel

```bash
ngrok http http://127.0.0.1:8000
```

Copy the forwarding URL like:

```
https://your-ngrok-id.ngrok-free.app
```

### 2️⃣ Update `.env`

```env
APP_URL=https://your-ngrok-id.ngrok-free.app
L5_SWAGGER_CONST_HOST=${APP_URL}
```

Then regenerate Swagger:

```bash
php artisan config:clear
php artisan l5-swagger:generate
```

### 3️⃣ Access Swagger UI

👉 Open

```
https://your-ngrok-id.ngrok-free.app/api/documentation
```

---

## 🔐 How to Test APIs on Swagger

### Step 1: Login

Run **POST `/api/login`** using:

```json
{
  "email": "demo@user.test",
  "password": "password"
}
```

You’ll get a token like:

```
"token": "17|wmwuVxNfwhYMOE9Hi1zorc5BYWeLLCjLqD2y2CBZacc0bc85"
```

### Step 2: Authorize

Click the **Authorize 🔓** button and enter:

```
Bearer 17|wmwuVxNfwhYMOE9Hi1zorc5BYWeLLCjLqD2y2CBZacc0bc85
```

### Step 3: Test APIs

* `GET /api/people` → Get paginated users
* `POST /api/people/{id}/like` → Like someone
* `POST /api/people/{id}/dislike` → Dislike someone
* `GET /api/me/likes` → View your liked people
* `GET /api/ping` → Health check

---

## 🧠 Cron Job (Admin Notification)

Command to send email if someone has 50+ likes:

```bash
php artisan popular:people --threshold=50 --to=admin@example.com
```

For daily scheduling (9 AM):

```bash
php artisan schedule:work
```

---

## 📱 Running the React Native Frontend

```bash
cd ../mobile
npm install
```

### Setup environment

Create `.env` file in the mobile folder:

```env
EXPO_PUBLIC_API_BASE_URL=https://your-ngrok-id.ngrok-free.app
```

### Run the app

```bash
npx expo start
```

Login → Swipe → Like → See liked list in action ✨

---

## 🎥 Demo Videos

🎬 **Tinder Fullstack App — React Native UI + Laravel Backend Integration:**
👉 


https://github.com/user-attachments/assets/74ea64ba-39d1-407b-a0a1-461ae562bc56



🎬 **Backend (Swagger API Testing):**
👉 

https://github.com/user-attachments/assets/ec400f2e-4296-420b-866d-c0739d39cfd0



---

## ✅ Summary

| Component                         | Status |
| --------------------------------- | ------ |
| Backend APIs (Laravel)            | ✅ Done |
| Swagger (Public & Working)        | ✅ Done |
| Auth + Token + Bearer Setup       | ✅ Done |
| Cronjob (Mail Command)            | ✅ Done |
| React Native UI + API Integration | ✅ Done |
| Documentation (README)            | ✅ Done |

---

### 👨‍💻 Author

**Ashish Kumar**

---








