import { useState, useEffect } from "react";

function Orders() {
  const [orders, setOrders] = useState([]);

  const [customer, setCustomer] = useState("");
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [status, setStatus] = useState("Pending");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // GET - Load orders
  useEffect(() => {
    fetch("http://localhost:5000/api/orders", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        setOrders(data);
      })
      .catch((error) => {
        console.log("Error fetching orders:", error);
      });
  }, [token]);

  // POST - Add order
  const addOrder = () => {
    if (
      customer === "" ||
      product === "" ||
      quantity === ""
    ) {
      alert("Please fill all fields");
      return;
    }

    const newOrder = {
      customer: customer,
      product: product,
      quantity: Number(quantity),
      status: status
    };

    fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(newOrder)
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        if (data.order) {
          setOrders([...orders, data.order]);

          setCustomer("");
          setProduct("");
          setQuantity("");
          setStatus("Pending");
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        console.log("Error adding order:", error);
      });
  };

  // PUT - Edit order
  const editOrder = (order) => {
    const newCustomer = prompt(
      "Enter customer name:",
      order.customer
    );

    const newProduct = prompt(
      "Enter product name:",
      order.product
    );

    const newQuantity = prompt(
      "Enter quantity:",
      order.quantity
    );

    const newStatus = prompt(
      "Enter status:",
      order.status
    );

    if (
      newCustomer === null ||
      newProduct === null ||
      newQuantity === null ||
      newStatus === null
    ) {
      return;
    }

    const updatedOrder = {
      customer: newCustomer,
      product: newProduct,
      quantity: Number(newQuantity),
      status: newStatus
    };

    fetch(
      `http://localhost:5000/api/orders/${order.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedOrder)
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        if (data.order) {
          const updatedOrders = orders.map((item) => {
            if (item.id === order.id) {
              return data.order;
            }

            return item;
          });

          setOrders(updatedOrders);
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        console.log("Error updating order:", error);
      });
  };

  // DELETE - Delete order
  const deleteOrder = (orderId) => {
    fetch(
      `http://localhost:5000/api/orders/${orderId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        if (data.message === "Order deleted successfully") {
          const updatedOrders = orders.filter(
            (order) => order.id !== orderId
          );

          setOrders(updatedOrders);
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        console.log("Error deleting order:", error);
      });
  };

  return (
    <div className="orders">
      <h2>Orders</h2>

      {/* Everyone can add orders */}
      <div>
        <input
          type="text"
          placeholder="Customer name"
          value={customer}
          onChange={(e) =>
            setCustomer(e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Product name"
          value={product}
          onChange={(e) =>
            setProduct(e.target.value)
          }
        />

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) =>
            setQuantity(e.target.value)
          }
        />

        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
        >
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Completed">Completed</option>
        </select>

        <button onClick={addOrder}>
          Add Order
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer}</td>
              <td>{order.product}</td>
              <td>{order.quantity}</td>
              <td>{order.status}</td>

              <td>
                {/* Admin and Manager can edit */}
                {(user?.role === "Admin" ||
                  user?.role === "Manager") && (
                  <button
                    onClick={() =>
                      editOrder(order)
                    }
                  >
                    Edit
                  </button>
                )}

                {/* Only Admin can delete */}
                {user?.role === "Admin" && (
                  <button
                    onClick={() =>
                      deleteOrder(order.id)
                    }
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Orders;