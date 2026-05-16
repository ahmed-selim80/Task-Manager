````md
# Task Manager API

A RESTful backend API for managing personal tasks. Built with **Node.js**, **Express**, **MongoDB**, **Mongoose**, and **JWT authentication**.

This project demonstrates authentication, protected routes, user-owned resources, task CRUD operations, query features, password reset, centralized error handling, and deployment-ready backend structure.

---

## Features

- User signup and login
- JWT-based authentication
- Protected routes
- User-owned task management
- Create, read, update, and delete tasks
- Task filtering, sorting, pagination, and field limiting
- Task statistics grouped by status
- Password reset flow using email token
- User profile update and account deactivation
- Admin-only user management routes
- Centralized error handling
- MongoDB Atlas support
- Render deployment-ready configuration

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** JSON Web Tokens
- **Password Hashing:** bcrypt
- **Email:** Nodemailer
- **Environment Variables:** dotenv
- **Development Tooling:** Nodemon

---

## Project Structure

```txt
Task-Manager/
├── controllers/
│   ├── authController.js
│   ├── errorController.js
│   ├── taskController.js
│   └── userController.js
├── models/
│   ├── taskModel.js
│   └── userModel.js
├── routes/
│   ├── authRoutes.js
│   ├── taskRoutes.js
│   └── userRoutes.js
├── utils/
│   ├── apiFeatures.js
│   ├── appError.js
│   ├── catchAsync.js
│   ├── email.js
│   └── filterObj.js
├── app.js
├── server.js
├── package.json
└── README.md
````

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ahmed-selim80/Task-Manager.git
cd Task-Manager
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment variables

Create a `config.env` file in the root directory:

```env
NODE_ENV=development
PORT=3000

DB_CONNECTION_STRING=mongodb+srv://<USERNAME>:<PASSWORD>@your-cluster-url/task-manager?retryWrites=true&w=majority
DB_USERNAME=your_mongodb_username
DB_PASSWORD=your_mongodb_password

JWT_SECRET=your_super_long_jwt_secret
JWT_EXPIRES_IN=90d

SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
```

### 4. Run the project locally

Development mode:

```bash
npm run start:dev
```

Production mode:

```bash
npm start
```

Server runs locally on:

```txt
http://localhost:3000
```

---

## API Base URL

### Local

```txt
http://localhost:3000/api/v1
```

### Production

```txt
https://task-manager-gc2j.onrender.com/
```

---

## API Documentation

Full API documentation is available here:

```txt
https://documenter.getpostman.com/view/48914644/2sBXqQHJwh
```

The documentation includes all available endpoints, request bodies, authentication requirements, example responses, and testing flow.

---

## Main API Routes

| Category | Method | Endpoint                            | Description                  |
| -------- | -----: | ----------------------------------- | ---------------------------- |
| Auth     |   POST | `/api/v1/auth/signup`               | Register a new user          |
| Auth     |   POST | `/api/v1/auth/login`                | Login and receive JWT        |
| Auth     |   POST | `/api/v1/auth/forgotPassword`       | Request password reset token |
| Auth     |  PATCH | `/api/v1/auth/resetPassword/:token` | Reset password               |
| Profile  |    GET | `/api/v1/users/getMe`               | Get current user profile     |
| Profile  |  PATCH | `/api/v1/users/updateMe`            | Update current user profile  |
| Profile  | DELETE | `/api/v1/users/deleteMe`            | Deactivate current account   |
| Tasks    |   POST | `/api/v1/tasks`                     | Create a task                |
| Tasks    |    GET | `/api/v1/tasks`                     | Get logged-in user's tasks   |
| Tasks    |    GET | `/api/v1/tasks/:id`                 | Get task by ID               |
| Tasks    |  PATCH | `/api/v1/tasks/:id`                 | Update task                  |
| Tasks    | DELETE | `/api/v1/tasks/:id`                 | Delete task                  |
| Tasks    |    GET | `/api/v1/tasks/stats`               | Get task statistics          |
| Admin    |    GET | `/api/v1/users`                     | Get all users                |
| Admin    |   POST | `/api/v1/users/createUser`          | Create user                  |
| Admin    |    GET | `/api/v1/users/:id`                 | Get user by ID               |
| Admin    |  PATCH | `/api/v1/users/:id`                 | Update user                  |
| Admin    | DELETE | `/api/v1/users/:id`                 | Delete user                  |

---

## Authentication

Protected routes require a JWT token in the request headers:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

You receive the token after signup or login.

---

## Example Task Object

```json
{
  "title": "Finish Task Manager API",
  "description": "Clean routes, test auth, and deploy to Render",
  "status": "todo",
  "priority": "high",
  "dueDate": "2026-05-17"
}
```

Allowed task status values:

```txt
todo
in-progress
done
```

Allowed priority values:

```txt
low
medium
high
```

---

## Query Features

The task list endpoint supports common API query features.

### Filter

```http
GET /api/v1/tasks?status=todo
```

### Sort

```http
GET /api/v1/tasks?sort=-createdAt
```

### Field Limiting

```http
GET /api/v1/tasks?fields=title,status,priority
```

### Pagination

```http
GET /api/v1/tasks?page=1&limit=5
```

### Combined Query

```http
GET /api/v1/tasks?status=todo&priority=high&sort=-createdAt&page=1&limit=5
```

---

## Deployment

This project is ready to deploy on Render as a Node.js web service.

### Render Settings

```txt
Build Command: npm install
Start Command: npm start
```

### Required Environment Variables on Render

```env
NODE_ENV=production
DB_CONNECTION_STRING=mongodb+srv://<USERNAME>:<PASSWORD>@your-cluster-url/task-manager?retryWrites=true&w=majority
DB_USERNAME=your_mongodb_username
DB_PASSWORD=your_mongodb_password
JWT_SECRET=your_super_long_jwt_secret
JWT_EXPIRES_IN=90d
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
```

Do not push `config.env` to GitHub.

---

## Skills Demonstrated

* REST API design
* Express routing and middleware
* MongoDB data modeling with Mongoose
* Authentication and authorization with JWT
* Password hashing with bcrypt
* Protected routes
* User-owned resource access control
* Query filtering, sorting, pagination, and field limiting
* Password reset token generation
* Centralized error handling
* Environment-based configuration
* Deployment-ready backend setup

---

## Author

**Ahmed Selim**

* GitHub: [https://github.com/ahmed-selim80](https://github.com/ahmed-selim80)
* LinkedIn: [https://www.linkedin.com/in/ahmed-selim-noshi80/](https://www.linkedin.com/in/ahmed-selim-noshi80/)
