# 🗂️ Task Management System

A **web-based task management system** built with **React (frontend)** and **Laravel (backend)** that supports two user roles: `admin` and `user`. The system enables task creation, assignment, status tracking, and time monitoring.

---

## ✅ Features

### 🔐 Role-Based Access
- **Admin**:
  - Create and manage users
  - Assign tasks to users
  - View all tasks and users
  - Edit or delete tasks
  - Monitor time spent on tasks by users

- **User**:
  - View assigned tasks
  - Update task status (`in_progress`, `completed`)
  - Add remarks to tasks
  - Track time spent automatically when task is `in_progress`

---

## 🚀 Setup Instructions

### 📁 1. Clone the Repository

```bash
git clone https://github.com/Avishka-bandara/TaskManagemnetApp.git
cd TaskManagemnetApp
```

---

## 🔧 Backend (Laravel)

### 📂 Navigate to `backend` folder

```bash
cd backend
```

### 🧩 Install Dependencies

```bash
composer install
```

### 🔐 Create `.env` file

```bash
cp .env.example .env
```

Edit your `.env` and set DB credentials.

### 🗄️ Generate App Key

```bash
php artisan jwt:secret

```

### 🛠️ Run Migrations & Seeder

```bash
php artisan migrate --seed
```

> ☑️ The seeder will create:
> - An `admin` user (`admin@example.com`, `password`)
> - A sample `user` and `tasks`

### ▶️ Start the Laravel Server

```bash
php artisan serve
```

---

## 🌐 Frontend (React)

### 📂 Navigate to `frontend` folder

```bash
cd frontend
```

### 📦 Install Dependencies

```bash
npm install
```

### ▶️ Run React App

```bash
npm start
```

The app will open at `http://localhost:3000`

---

## 🔑 Default Admin Login

```text
Email: admin@admin.com
Password: admin123
```

---

## 🧰 Tools & Technologies Used

| Tool         | Purpose                      |
|--------------|-------------------------------|
| Laravel      | Backend Framework (REST API)  |
| React        | Frontend UI                   |
| Axios        | HTTP Requests                 |
| Bootstrap 5  | Styling & UI Components       |
| MySQL        | Database                      |
| JWT Auth     | User Authentication           |

---

## 📌 Project Structure

```
/backend     → Laravel API
/frontend    → React UI
```

---

## 📬 Contact

For any questions or issues, feel free to contact the project maintainer.

---
