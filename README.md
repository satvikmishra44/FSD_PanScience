# 📋 Task Management System

A full-stack task management application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring role-based access control, file attachments, and containerized deployment with Docker[web:8][web:11].

## 🚀 Features

- **User Authentication** - Secure JWT-based login and registration system with bcrypt password hashing
- **Role-Based Access Control** - Admin and user roles with different privileges
- **Task Management** - Create, read, update, and delete tasks with status tracking
- **Task Assignment** - Assign tasks to specific users with priority levels
- **File Attachments** - Upload PDF attachments (up to 3 per task) using Multer
- **User Dashboard** - View assigned tasks with filtering and sorting capabilities
- **Admin Panel** - User management, role promotion, and system-wide task overview
- **Responsive UI** - Modern React-based frontend with modals and interactive components
- **Docker Support** - One-command deployment with Docker Compose

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library for building interactive interfaces
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **CSS3** - Custom styling

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload middleware
- **CORS** - Cross-Origin Resource Sharing

### DevOps
- **Docker** - Containerization platform
- **Docker Compose** - Multi-container orchestration
- **MongoDB 8.0** - Database container

- ### 🧱 Full Tech Stack
| Layer | Technology |
|-------|-------------|
| **Frontend** | React + TailwindCSS |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB |
| **File Uploads** | Multer |
| **Authentication** | JWT + bcrypt |
| **Containerization** | Docker + Docker Compose |

## 🔧 Prerequisites

Before running this application, ensure you have the following installed:

- **Docker** (v20.10+)
- **Docker Compose** (v2.0+)

**OR** for local development without Docker:

- **Node.js** (v18+)
- **MongoDB** (v8.0+)
- **npm** or **yarn**

## 🚀 Quick Start with Docker (Recommended)

### 1. Clone the Repository

## 🐳 Run the Entire App with Docker

> You can run the full stack (Frontend + Backend + MongoDB) with **a single command**.

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/satvikmishra44/FSD_PanScience.git
cd fsd_panscience
```

### 2. Start the Application
```bash
docker-compose up
```
## 🚀 Access the App

### 4. Default Admin Access

To create an admin user, register with the email:

Email: admin@email.com
Password: [your-password]

This account will automatically be assigned admin privileges.

# You Can Create Multiple Ids And Explore Various Functioanalities Too

## 🧩 API Endpoints

All endpoints assume your backend is running at:

http://localhost:3000

---

### **Auth Routes**

#### Register a New User
```bash
POST /auth/register
Request Body (JSON):

{
  "name": "John Doe",
  "email": "john@email.com",
  "password": "123456"
}

cURL Example:

curl -X POST http://localhost:3000/auth/register \
-H "Content-Type: application/json" \
-d '{
  "name": "John Doe",
  "email": "john@email.com",
  "password": "123456"
}'

Response:


{
  "success": true,
  "message": "User Successfully Registered"
}

Login User

POST /auth/login
Request Body (JSON):

{
  "email": "john@email.com",
  "password": "123456"
}

cURL Example:

curl -X POST http://localhost:3000/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "john@email.com",
  "password": "123456"
}'

Response:

{
  "token": "JWT_TOKEN",
  "id": "USER_ID",
  "name": "John Doe",
  "role": "user"
}

Get Self Details

GET /auth/me?id=<USER_ID>
cURL Example:

curl http://localhost:3000/auth/me?id=USER_ID
Response:

{
  "_id": "USER_ID",
  "name": "John Doe",
  "email": "john@email.com",
  "role": "user",
  "tasks": [...]
}

Task Routes

Create a New Task

POST /task/create
Form Data (multipart/form-data):

Field	Type	Description
title	string	Task title
description	string	Task details
priority	enum	low / medium / high
status	enum	pending / in-progress / completed
dueDate	date	Due date
assignedTo	string	User ID
attachments	file	PDF files (max 3)

cURL Example:

curl -X POST http://localhost:3000/task/create \
-F "title=My Task" \
-F "description=Complete the project" \
-F "priority=medium" \
-F "status=pending" \
-F "dueDate=2025-10-20" \
-F "assignedTo=USER_ID" \
-F "attachments=@/path/to/file1.pdf" \
-F "attachments=@/path/to/file2.pdf"
Response:

{
  "message": "Task created and assigned successfully",
  "task": {
    "_id": "TASK_ID",
    "title": "My Task",
    "status": "pending",
    "priority": "medium",
    "assignedTo": "USER_ID",
    "attachments": ["uploads/attachments/file1.pdf", "uploads/attachments/file2.pdf"]
  }
}

Get Task by ID

GET /task/:id
cURL Example:

curl http://localhost:3000/task/TASK_ID
Response:

{
  "_id": "TASK_ID",
  "title": "Task Title",
  "description": "Task description",
  "status": "pending",
  "priority": "medium",
  "dueDate": "2025-10-20T00:00:00Z",
  "assignedTo": "User Name",
  "attachments": ["uploads/attachments/file.pdf"]
}

Update Task

PUT /task/:id
Request Body (JSON):

{
  "status": "in-progress",
  "priority": "high"
}
cURL Example:

curl -X PUT http://localhost:3000/task/TASK_ID \
-H "Content-Type: application/json" \
-d '{
  "status": "in-progress",
  "priority": "high"
}'
Response:

{
  "message": "Task updated successfully",
  "task": {
    "_id": "TASK_ID",
    "title": "Task Title",
    "status": "in-progress",
    "priority": "high"
  }
}

Delete Task

DELETE /task/:id
cURL Example:

curl -X DELETE http://localhost:3000/task/TASK_ID
Response:

{
  "message": "Task deleted successfully"
}

Admin Routes

Get All Users

GET /admin/users
cURL Example:

curl http://localhost:3000/admin/users
Get All Tasks

GET /admin/tasks
cURL Example:

curl http://localhost:3000/admin/tasks

Get Single User with Last 3 Tasks
GET /admin/users/:id
cURL Example:
curl http://localhost:3000/admin/users/USER_ID
Promote User to Admin
PUT /admin/users/:id
Request Body (JSON):
{
  "role": "admin"
}
cURL Example:

curl -X PUT http://localhost:3000/admin/users/USER_ID \
-H "Content-Type: application/json" \
-d '{"role": "admin"}'

Response:

{
  "message": "John Doe promoted to Admin"
}
Delete a User
DELETE /admin/users/:id

cURL Example:

curl -X DELETE http://localhost:3000/admin/users/USER_ID
Response:

{
  "message": "User deleted successfully"
}
User Task Routes
Get All Tasks for a User
bash
Copy code
GET /auth/tasks?id=<USER_ID>

cURL Example:

curl http://localhost:3000/auth/tasks?id=USER_ID
Response:
[
  {
    "_id": "TASK_ID",
    "title": "Task Title",
    "status": "pending",
    "priority": "medium"
  }
]
