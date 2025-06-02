# MERN Stack Backend with Redis

## Project Overview

This project is a Node.js + Express.js backend application for managing users and products, backed by MongoDB and enhanced with Redis caching. It supports full CRUD operations and optimizes repeated fetches using cache-first logic.

---

## Project Structure

```
/backend
│
├── controllers/
│   ├── product.controller.js
│   └── user.controller.js
│
├── models/
│   ├── product.model.js
│   └── user.model.js
│
├── routes/
│   ├── product.routes.js
│   └── user.routes.js
│
├── client/
│   └── redisClient.js
│
├── .env
├── server.js
└── package.json

/frontend
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── store/      
│   ├── App.jsx
│   └── main.jsx
│
├── index.html
└── vite.config.js
```

---

## Features

*  User Registration with unique username
*  Password encoding (base64 for demo purposes)
*  Add, update, delete, fetch products by user
*  Pagination support for products
*  Redis caching for read-heavy routes
*  Graceful error handling
*  Modular controller/route structure

---

## Tech Stack

* Node.js
* Express.js
* MongoDB (with Mongoose)
* Redis (for caching)
* dotenv

---

## API Endpoints

###  User Routes

| Method | Endpoint           | Description             |
| ------ | ------------------ | ----------------------- |
| POST   | `/api/user`        | Create a new user       |
| GET    | `/api/user/:user1` | Get user(s) by username |

###  Product Routes

| Method | Endpoint                              | Description                 |
| ------ | ------------------------------------- | --------------------------- |
| POST   | `/api/product`                        | Create a new product        |
| GET    | `/api/product/:userId/:offset/:limit` | Get paginated user products |
| PUT    | `/api/product/:id`                    | Update a product            |
| DELETE | `/api/product/:id`                    | Delete a product            |

---

##  Redis Caching Logic

* Key pattern: `products:${userId}:${offset}:${limit}`
* Flow:

  1. Check if the key exists in Redis.
  2. If found, return cached data.
  3. Else, fetch from MongoDB, store in Redis, and return it.

---

##  Environment Variables

Create a `.env` file with the following:

```
MONGO_URI=your_mongodb_connection_string
REDIS_URL=redis://localhost:6379
PORT=5000
```

---

##  Getting Started

```bash
npm install
npm run dev
```

Make sure MongoDB and Redis are running locally or are accessible remotely.

---

### Integrations

* Fetch products with pagination using backend endpoints
* Show cached vs fresh data indicator (if needed)
* Handle login and product creation via forms

---
