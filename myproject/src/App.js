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
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="app-container">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="sidebar-logo">
          <div className="logo-icon">B2B</div>

          <div>
            <h2>Order Management</h2>
            <span>Management System</span>
          </div>
        </div>


        {/* USER */}

        <div className="sidebar-user">

          <div className="user-avatar">
            {user?.username?.charAt(0).toUpperCase()}
          </div>

          <div>
            <strong>{user?.username}</strong>
            <span>{user?.role}</span>
          </div>

        </div>


        {/* MENU */}

        <div className="menu-title">
          MAIN MENU
        </div>


        <div className="sidebar-menu">

          <button
            className={page === "dashboard" ? "menu-item active" : "menu-item"}
            onClick={() => setPage("dashboard")}
          >
            <span className="menu-icon">📊</span>
            Dashboard
          </button>


          <button
            className={page === "products" ? "menu-item active" : "menu-item"}
            onClick={() => setPage("products")}
          >
            <span className="menu-icon">📦</span>
            Products
          </button>


          <button
            className={page === "orders" ? "menu-item active" : "menu-item"}
            onClick={() => setPage("orders")}
          >
            <span className="menu-icon">🛒</span>
            Orders
          </button>


          <button
            className={page === "stock" ? "menu-item active" : "menu-item"}
            onClick={() => setPage("stock")}
          >
            <span className="menu-icon">📋</span>
            Stock
          </button>


          {user && user.role === "Admin" && (
            <button
              className={page === "admin" ? "menu-item active" : "menu-item"}
              onClick={() => setPage("admin")}
            >
              <span className="menu-icon">👥</span>
              Admin
            </button>
          )}

        </div>


        {/* BOTTOM */}

        <div className="sidebar-bottom">

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            <span className="menu-icon">🚪</span>
            Logout
          </button>

        </div>

      </aside>


      {/* MAIN CONTENT */}

      <main className="main-content">

        <div className="top-header">

          <div>
            <h1>
              {page === "dashboard" && "Dashboard"}
              {page === "products" && "Products"}
              {page === "orders" && "Orders"}
              {page === "stock" && "Stock Management"}
              {page === "admin" && "Admin / Users"}
            </h1>

            <p>
              Welcome back, {user?.username}
            </p>
          </div>


          <div className="header-user">

            <div className="header-avatar">
              {user?.username?.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{user?.username}</strong>
              <span>{user?.role}</span>
            </div>

          </div>

        </div>


        {/* PAGE CONTENT */}

        <div className="page-content">

          {page === "dashboard" && (
            <Dashboard />
          )}

          {page === "products" && (
            <Products />
          )}

          {page === "orders" && (
            <Orders />
          )}

          {page === "stock" && (
            <Stock />
          )}

          {page === "admin" &&
            user &&
            user.role === "Admin" && (
              <Admin />
            )}

        </div>

      </main>

    </div>
  );
}

export default App;