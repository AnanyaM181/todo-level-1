# 📓 Daybook — Todo App

A full-stack todo application built with React and Node.js. 
Daybook helps you manage your daily tasks with priorities, 
due dates, and a clean minimal interface.


---

## ✨ Features

- 🔐 **Authentication** — Signup and login with JWT
- ✅ **Todo Management** — Add, edit, delete and complete todos
- 📝 **Description** — Add details to each task
- 🎯 **Priority Levels** — Mark tasks as 🔴 High, 🟡 Medium, 🟢 Low
- 📅 **Due Dates** — Set deadlines with overdue warnings ⚠️
- 🔍 **Search** — Find tasks by name or description
- 🔽 **Filter** — Filter by status (All/Pending/Completed) and priority
- 🌙 **Dark Mode** — Toggle between light and dark theme
- 🎉 **Confetti** — Celebrate when all tasks are done!
- ⏱️ **Timestamps** — See when tasks were created and updated

---

## 🛠️ Technologies Used

### Frontend
- React 18
- Vite
- React Router DOM
- Canvas Confetti

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (JSON Web Tokens)
- bcryptjs

---

## 📁 Folder Structure

todo-level-1/
├── frontend/
│ ├── src/
│ │ ├── pages/
│ │ │ ├── Login.jsx
│ │ │ ├── Signup.jsx
│ │ │ └── Todos.jsx
│ │ ├── api.js
│ │ ├── App.jsx
│ │ ├── AuthContext.jsx
│ │ └── styles.css
│ ├── package.json
│ └── vite.config.js
│
└── backend/
├── middleware/
│ └── auth.js
├── models/
│ ├── User.js
│ └── Todo.js
├── routes/
│ ├── auth.js
│ └── todos.js
├── server.js
└── package.json


---

## 🚀 How to Run Locally

### Prerequisites
- Node.js installed
- MongoDB installed (or MongoDB Compass)

### 1. Clone the repository
```bash
git clone https://github.com/AnanyaM181/todo-level-1.git
cd todo-level-1
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

PORT=5000
MONGO_URI=mongodb://localhost:27017/daybook
JWT_SECRET=your_secret_key


Start the backend:
```bash
npm start
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Open the app
Go to `http://localhost:5173` in your browser!

---

## 👩‍💻 Author

**Ananya Mohapatra**
- GitHub: [@AnanyaM181](https://github.com/AnanyaM181)

---

## 📌 Note

This project was built as a learning project to practice 
full-stack web development with React and Node.js.
