import { useState, useEffect } from "react";

function Stock() {
  const [stockData, setStockData] = useState([]);

  const token = localStorage.getItem("token");

  // GET - Load stock
  useEffect(() => {
    fetch("http://localhost:5000/api/stock", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        setStockData(data);
      })
      .catch((error) => {
        console.log("Error fetching stock:", error);
      });
  }, [token]);

  // PUT - Update stock
  const updateStock = (id, amount) => {
    const item = stockData.find((stock) => stock.id === id);

    if (!item) {
      return;
    }

    const newStock = Math.max(0, item.stock + amount);

    fetch(`http://localhost:5000/api/stock/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        stock: newStock
      })
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        const updatedStock = stockData.map((stock) => {
          if (stock.id === id) {
            return {
              ...stock,
              stock: newStock
            };
          }

          return stock;
        });

        setStockData(updatedStock);
      })
      .catch((error) => {
        console.log("Error updating stock:", error);
      });
  };

  return (
    <div className="stock">
      <h2>Stock Management</h2>

      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Available Stock</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {stockData.map((item) => (
            <tr key={item.id}>
              <td>{item.product}</td>

              <td>
                {item.stock}

                <button
                  onClick={() => updateStock(item.id, -1)}
                >
                  -
                </button>

                <button
                  onClick={() => updateStock(item.id, 1)}
                >
                  +
                </button>
              </td>

              <td>
                {item.stock > 10 ? "In Stock" : "Low Stock"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Stock;