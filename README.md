# B2B Order Management Platform

A full-stack B2B Order Management Platform developed using React.js, Node.js, Express.js, and MySQL.

## Features

- User Login
- JWT Authentication
- Role-Based Access Control
- Dashboard
- Product Management
- Order Management
- Stock Management
- Admin / User Management
- Responsive Design
- MySQL Database
- Password Hashing using bcrypt
- REST API

## Technologies

- React.js
- Node.js
- Express.js
- MySQL
- JWT
- bcryptjs
- CSS
- Git & GitHub

## User Roles

### Admin

- Manage Products
- Manage Orders
- Manage Stock
- View Users
- Full system access

### Manager

- View Products
- Add Products
- Edit Products
- Add Orders
- Edit Orders
- Update Stock

### Staff

- View Products
- Add Orders
- Update Stock

## Project Structure

text
B2B Order Management Platform

│
├── backend

│   ├── server.js

│   ├── package.json

│   └── .env

│

├── myproject

│   ├── public

│   ├── src

│   │   ├── App.js

│   │   ├── App.css

│   │   ├── Login.js

│   │   ├── Dashboard.js

│   │   ├── Products.js

│   │   ├── Orders.js

│   │   ├── Stock.js

│   │   └── Admin.js


│   └── package.json

│

└── README.md

How to Run
Backend

Open terminal:

cd backend
npm install
node server.js

Backend runs at:

http://localhost:5000
Frontend

Open another terminal:

cd myproject
npm install
npm start

Frontend runs at:

http://localhost:3000

Database

Database used:

MySQL

Database name:

products_db

Main tables:

products
orders
stock
users
login_users

Authentication

The application uses:

JWT for authentication
bcryptjs for password hashing
Role-based authorization

Developer
Akash Yadav
Full Stack Development Intern
