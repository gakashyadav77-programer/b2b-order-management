require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

const PORT = 5000;

// ==================== DATABASE ====================

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.log("MySQL connection failed:", err);
    return;
  }

  console.log("MySQL connected successfully");
});

// ==================== MIDDLEWARE ====================

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;

// ==================== JWT AUTHENTICATION ====================

// Verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Access denied. Token required."
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Access denied. Token required."
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token."
    });
  }
};

// ==================== ROLE AUTHORIZATION ====================

// Check user role
const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied. You do not have permission."
      });
    }

    next();
  };
};

// ==================== PRODUCTS ====================

// GET - Get all products
app.get("/api/products", verifyToken, (req, res) => {
  const sql = "SELECT * FROM products";

  db.query(sql, (err, results) => {
    if (err) {
      console.log("Error fetching products:", err);

      return res.status(500).json({
        message: "Error fetching products"
      });
    }

    res.json(results);
  });
});

// POST - Add product
app.post(
  "/api/products",
  verifyToken,
  allowRoles("Admin", "Manager"),
  (req, res) => {
    const { name, price, stock } = req.body;

    const sql = `
      INSERT INTO products (name, price, stock)
      VALUES (?, ?, ?)
    `;

    db.query(sql, [name, price, stock], (err, result) => {
      if (err) {
        console.log("Error adding product:", err);

        return res.status(500).json({
          message: "Error adding product"
        });
      }

      res.status(201).json({
        message: "Product added successfully",

        product: {
          id: result.insertId,
          name: name,
          price: price,
          stock: stock
        }
      });
    });
  }
);

// DELETE - Delete product
app.delete(
  "/api/products/:id",
  verifyToken,
  allowRoles("Admin"),
  (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM products WHERE id = ?";

    db.query(sql, [id], (err, result) => {
      if (err) {
        console.log("Error deleting product:", err);

        return res.status(500).json({
          message: "Error deleting product"
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Product not found"
        });
      }

      res.json({
        message: "Product deleted successfully"
      });
    });
  }
);

// PUT - Update product
app.put(
  "/api/products/:name",
  verifyToken,
  allowRoles("Admin", "Manager"),
  (req, res) => {
    const { name } = req.params;
    const { price, stock } = req.body;

    const sql = `
      UPDATE products
      SET price = ?, stock = ?
      WHERE name = ?
    `;

    db.query(sql, [price, stock, name], (err, result) => {
      if (err) {
        console.log("Error updating product:", err);

        return res.status(500).json({
          message: "Error updating product"
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Product not found"
        });
      }

      res.json({
        message: "Product updated successfully",

        product: {
          name: name,
          price: price,
          stock: stock
        }
      });
    });
  }
);

// ==================== ORDERS ====================

// GET - Get all orders
app.get("/api/orders", verifyToken, (req, res) => {
  const sql = "SELECT * FROM orders";

  db.query(sql, (err, results) => {
    if (err) {
      console.log("Error fetching orders:", err);

      return res.status(500).json({
        message: "Error fetching orders"
      });
    }

    res.json(results);
  });
});

// POST - Add order
app.post(
  "/api/orders",
  verifyToken,
  allowRoles("Admin", "Manager", "Staff"),
  (req, res) => {
    const { customer, product, quantity, status } = req.body;

    const sql = `
      INSERT INTO orders (customer, product, quantity, status)
      VALUES (?, ?, ?, ?)
    `;

    db.query(
      sql,
      [customer, product, quantity, status],
      (err, result) => {
        if (err) {
          console.log("Error adding order:", err);

          return res.status(500).json({
            message: "Error adding order"
          });
        }

        res.status(201).json({
          message: "Order added successfully",

          order: {
            id: result.insertId,
            customer: customer,
            product: product,
            quantity: quantity,
            status: status
          }
        });
      }
    );
  }
);

// PUT - Update order
app.put(
  "/api/orders/:id",
  verifyToken,
  allowRoles("Admin", "Manager"),
  (req, res) => {
    const { id } = req.params;
    const { customer, product, quantity, status } = req.body;

    const sql = `
      UPDATE orders
      SET customer = ?, product = ?, quantity = ?, status = ?
      WHERE id = ?
    `;

    db.query(
      sql,
      [customer, product, quantity, status, id],
      (err, result) => {
        if (err) {
          console.log("Error updating order:", err);

          return res.status(500).json({
            message: "Error updating order"
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            message: "Order not found"
          });
        }

        res.json({
          message: "Order updated successfully",

          order: {
            id: Number(id),
            customer: customer,
            product: product,
            quantity: quantity,
            status: status
          }
        });
      }
    );
  }
);

// DELETE - Delete order
app.delete(
  "/api/orders/:id",
  verifyToken,
  allowRoles("Admin"),
  (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM orders WHERE id = ?";

    db.query(sql, [id], (err, result) => {
      if (err) {
        console.log("Error deleting order:", err);

        return res.status(500).json({
          message: "Error deleting order"
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Order not found"
        });
      }

      res.json({
        message: "Order deleted successfully"
      });
    });
  }
);

// ==================== STOCK ====================

// GET - Get all stock
app.get("/api/stock", verifyToken, (req, res) => {
  const sql = "SELECT * FROM stock";

  db.query(sql, (err, results) => {
    if (err) {
      console.log("Error fetching stock:", err);

      return res.status(500).json({
        message: "Error fetching stock"
      });
    }

    res.json(results);
  });
});

// PUT - Update stock
app.put(
  "/api/stock/:id",
  verifyToken,
  allowRoles("Admin", "Manager", "Staff"),
  (req, res) => {
    const { id } = req.params;
    const { stock } = req.body;

    const sql = `
      UPDATE stock
      SET stock = ?
      WHERE id = ?
    `;

    db.query(sql, [stock, id], (err, result) => {
      if (err) {
        console.log("Error updating stock:", err);

        return res.status(500).json({
          message: "Error updating stock"
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Stock item not found"
        });
      }

      res.json({
        message: "Stock updated successfully",

        stock: {
          id: Number(id),
          stock: stock
        }
      });
    });
  }
);

// ==================== USERS ====================

// GET - Get all users
app.get(
  "/api/users",
  verifyToken,
  allowRoles("Admin"),
  (req, res) => {
    const sql = "SELECT * FROM users";

    db.query(sql, (err, results) => {
      if (err) {
        console.log("Error fetching users:", err);

        return res.status(500).json({
          message: "Error fetching users"
        });
      }

      res.json(results);
    });
  }
);

// ==================== AUTHENTICATION ====================

// POST - Login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const sql = `
    SELECT * FROM login_users
    WHERE username = ?
  `;

  db.query(sql, [username], async (err, results) => {
    if (err) {
      console.log("Error during login:", err);

      return res.status(500).json({
        message: "Login error"
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        message: "Invalid username or password"
      });
    }

    const user = results[0];

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid username or password"
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role
      },
      JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );

    res.json({
      message: "Login successful",

      token: token,

      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  });
});

// ==================== DASHBOARD ====================

// GET - Dashboard counts
app.get(
  "/api/dashboard",
  verifyToken,
  (req, res) => {
    const sql = `
      SELECT
        (SELECT COUNT(*) FROM products) AS products,
        (SELECT COUNT(*) FROM orders) AS orders,
        (SELECT COALESCE(SUM(stock), 0) FROM stock) AS stock,
        (SELECT COUNT(*) FROM users) AS users
    `;

    db.query(sql, (err, results) => {
      if (err) {
        console.log("Error fetching dashboard:", err);

        return res.status(500).json({
          message: "Error fetching dashboard data"
        });
      }

      res.json(results[0]);
    });
  }
);

// ==================== SERVER ====================

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});