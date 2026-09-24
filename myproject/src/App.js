import "./App.css";
import { useState, useEffect } from "react";

import Login from "./Login";
import Dashboard from "./Dashboard";
import Products from "./Products";
import Orders from "./Orders";
import Stock from "./Stock";
import Admin from "./Admin";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("token") !== null
  );

  const [page, setPage] = useState("dashboard");

  const user = JSON.parse(localStorage.getItem("user"));

  // Check JWT token expiration
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsLoggedIn(false);
        return;
      }

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));

        const currentTime = Math.floor(Date.now() / 1000);

        if (payload.exp && payload.exp < currentTime) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          setIsLoggedIn(false);
          setPage("dashboard");

          alert("Session expired. Please login again.");
        }
      } catch (error) {
        console.log("Invalid token");

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setIsLoggedIn(false);
      }
    };

    checkToken();

    const interval = setInterval(checkToken, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    setPage("dashboard");
  };

  if (!isLoggedIn) {
    return (
      <Login
        onLogin={() => setIsLoggedIn(true)}
      />
    );
  }

  return (
    <div>
      <nav>
        <h2>B2B Order Management</h2>

        <div>
          <button
            onClick={() => setPage("dashboard")}
          >
            Dashboard
          </button>

          <button
            onClick={() => setPage("products")}
          >
            Products
          </button>

          <button
            onClick={() => setPage("orders")}
          >
            Orders
          </button>

          <button
            onClick={() => setPage("stock")}
          >
            Stock
          </button>

          {user && user.role === "Admin" && (
            <button
              onClick={() => setPage("admin")}
            >
              Admin
            </button>
          )}

          <button onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {page === "dashboard" && (
        <>
          <h1>Welcome to B2B Order Management</h1>

          <p>
            Manage products, orders, stock and invoices.
          </p>

          <Dashboard />
        </>
      )}

      {page === "products" && <Products />}

      {page === "orders" && <Orders />}

      {page === "stock" && <Stock />}

      {page === "admin" &&
        user &&
        user.role === "Admin" && (
          <Admin />
        )}
    </div>
  );
}

export default App;