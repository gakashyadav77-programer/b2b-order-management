import { useState, useEffect } from "react";

function Dashboard() {
  const [dashboard, setDashboard] = useState({
    products: 0,
    orders: 0,
    stock: 0,
    users: 0
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5000/api/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        setDashboard(data);
      })
      .catch((error) => {
        console.log("Error fetching dashboard:", error);
      });
  }, [token]);

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>

      <div className="cards">
        <div className="card">
          <h3>Products</h3>
          <p>{dashboard.products}</p>
        </div>

        <div className="card">
          <h3>Orders</h3>
          <p>{dashboard.orders}</p>
        </div>

        <div className="card">
          <h3>Stock</h3>
          <p>{dashboard.stock}</p>
        </div>

        <div className="card">
          <h3>Users</h3>
          <p>{dashboard.users}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;