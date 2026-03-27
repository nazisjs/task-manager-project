## 👤 Authors - SE - 1-22

- Murat Nazerke
- Satybay Shynar
- Tolegen Aikorkem
  
# 🌻 SunDo — Task Manager

SunDo is a web-based task management application designed to help students organize their daily work and study routine.
Users can create tasks, set priorities, update their status, and track their progress over time.

The project is inspired by the sunflower. Just as a sunflower grows by turning toward the sun, students achieve big goals through small consistent actions and completed tasks.

---

## ✨ Features

* User registration and login
* Create, edit and delete tasks
* Task status tracking (To Do / In Progress / Done)
* Task priorities
* Personal task list for each user
* Progress monitoring

---

## 🛠 Tech Stack
**Frontend**
* React (Javascript)

**Backend**

* Python (Django rest framework)

**Database**

* PostgreSQL
  
**Tools**

* GitHub
* Figma

---

## ⚙️ Installation

### 1. Clone repository

git clone https://github.com/your-username/task-manager-project.git

### 2. Go to project folder

cd backend/todo_project
python manage.py runserver
install required packets

cd frontend/my-app
npm start
also install required packets

### 3. Create virtual environment

python -m venv venv

### 4. Activate environment (Windows)

venv\Scripts\activate

### 5. Install dependencies

pip install -r requirements.txt

### 6. Create .env file

Create a `.env` file and add:

SECRET_KEY=your_secret_key

DB_NAME=task_manager
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

### 7. Create database (PostgreSQL)

CREATE DATABASE task_manager;

### 8. Run server

python 

Open in browser:
http://127.0.0.1:3000

---

## 📁 Project Structure

- backend/todo_project
- frontend/my-app

---

## 🔌 API Endpoints

- GET /tasks — get all tasks
- POST /tasks — create task
- PUT /tasks/<id> — update task
- DELETE /tasks/<id> — delete task

---
