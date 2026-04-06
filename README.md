# Finance Dashboard Backend API

## Overview
This project is a backend system for a finance dashboard that manages users, financial records, and summary analytics. It demonstrates API design, role-based access control (RBAC), data modeling, and aggregation logic.

The system supports different user roles with controlled access to financial data and operations.

## Live API
Base URL:
https://assessment-zoorvyn.onrender.com

Swagger Documentation:
https://assessment-zoorvyn.onrender.com/api-docs

## Postman Collection
Import the following file into Postman to test APIs:
finance_management.postman_collection.json
---

## Features

### User & Role Management

* Create and manage users (Admin only)
* Assign roles: `admin`, `analyst`, `viewer`
* Activate/Deactivate users (soft delete via status a active or inactive)
* Role-based access control (RBAC)

---

### Financial Records Management

* Create, update, delete financial records (Admin only)
* View records (Admin, Analyst)
* Fields include:

  * amount
  * type (income/expense)
  * category
  * transaction_date
  * notes
* Soft delete using `is_deleted`

---

### Filtering Support

* Filter records by:

  * type
  * category
  * date range

---

### Dashboard APIs

Provides aggregated insights:

* Total income
* Total expenses
* Net balance
* Category-wise breakdown

---

### Authentication & Security

* JWT-based authentication
* Password hashing using bcrypt
* Protected routes, and roles based authorization with middleware
* Role-based authorization

---

### API Documentation

* Swagger UI available at:

```
https://bookingsystem-uy7w.onrender.com/api-docs/

```

---

## Tech Stack

* Node.js
* Express.js
* TiDB (MySQL compatible)
* JWT (Authentication)
* bcrypt (Password hashing)
* Swagger (API documentation)

---

## Project Structure

```
src/
├── controllers/
├── routes/
├── models/
├── middleware/
├── config/
├── swagger.yaml
├── server.js
├── app.js
```

---

## Setup Instructions

### 1. Clone the repository

```
git clone <your-repo-link>
cd ZOORVYN_ASSESMENT
```

### 2. Install dependencies

```
npm install
```

### 3. Configure environment variables

Create a `.env` file:

```
PORT=5000
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
JWT_SECRET=your_secret
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=thisisme@123
```

---

### 4. Run the server

```
npm run dev
```

---

## Admin Initialization

On server start:

* If no admin exists → system creates one using `.env` credentials and seed script

---

## Role-Based Access Control

| Role    | Permissions                               |
| ------- | ----------------------------------------- |
| Admin   | Full access (users + records + dashboard) |
| Analyst | Read records + dashboard                  |
| Viewer  | Dashboard only                            |

---

## API Endpoints

### Auth

* `POST /api/auth/login`

---

### Users (Admin only)

* `POST /api/users`
* `GET /api/users`
* `PATCH /api/users/:id`
* `DELETE /api/users/:id` (soft delete)

---

### Records

* `POST /api/records` (Admin)
* `GET /api/records` (Admin, Analyst)
* `PATCH /api/records/:id` (Admin)
* `DELETE /api/records/:id` (soft delete)

---

### Dashboard

* `GET /api/dashboard/summary`

---

## Key Design Decisions

### 1. Soft Deletes

* Records use `is_deleted`
* Users use `status = inactive`
* Prevents data loss and ensures auditability

---

### 2. Transaction Date vs Created At

* `transaction_date`: actual event date
* `created_at`: database insertion timestamp
* Enables accurate analytics

---

### 3. RBAC via Middleware

* Centralized role checks
* Clean separation of concerns

---

### 4. Dynamic Query Building

* Flexible updates and filtering
* Prevents unnecessary multiple endpoints

---

### 5. JWT Authentication

* Stateless and scalable
* Secure user identification

---

## Trade-offs

* Used simple RBAC instead of fine-grained permissions (for simplicity)
* No refresh tokens implemented (time constraint)
* No frontend (backend-focused assignment)
* Limited validation library (manual validation used)

---

## Known Limitations

* No pagination for large datasets (can be added)
* No rate limiting
* No advanced analytics (monthly trends optional)

---

## Future Improvements

* Add pagination and search
* Implement refresh tokens
* Add audit logging
* Add category master table
* Add unit/integration tests
* Add monthly/yearly trend analytics
* Realtime updates

---

## Conclusion

This project demonstrates:

* Clean backend architecture
* Proper API design
* Role-based access control
* Data modeling and aggregation logic

It focuses on correctness, clarity, and maintainability as required.

---
